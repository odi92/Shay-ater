import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateWork, validateWorks } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import type { AiAction, AspectRatio } from '@/types';
import type { WorkInsert } from '@/types/database';

const VALID_ASPECT_RATIOS: AspectRatio[] = ['16:9', '1:2.35', '4:3'];

function isAspectRatio(value: unknown): value is AspectRatio {
  return typeof value === 'string' && (VALID_ASPECT_RATIOS as string[]).includes(value);
}

function parsePromptBody(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return null;
  const prompt = (body as Record<string, unknown>)['prompt'];
  return typeof prompt === 'string' && prompt.trim().length > 0 ? prompt.trim() : null;
}

function parseAiResponse(text: string): AiAction | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch?.[0]) return null;
  try {
    const parsed: unknown = JSON.parse(jsonMatch[0]);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const obj = parsed as Record<string, unknown>;
    if (typeof obj['action'] !== 'string' || typeof obj['message'] !== 'string') return null;
    return {
      action: obj['action'] as AiAction['action'],
      workSlug: typeof obj['workSlug'] === 'string' ? obj['workSlug'] : undefined,
      fields: typeof obj['fields'] === 'object' && obj['fields'] !== null
        ? (obj['fields'] as AiAction['fields'])
        : undefined,
      message: obj['message'],
    };
  } catch {
    return null;
  }
}

const SYSTEM_PROMPT = `You are an AI assistant for managing content on Shay Ater's filmmaker portfolio website.

You help non-technical users manage works (films, music videos, etc.) by interpreting natural language requests and returning structured JSON actions.

The works database has the following structure:
- title: string (required)
- slug: string (auto-generated from title, lowercase-with-dashes)
- type: string (e.g. "Short film", "Music video", "Documentary", "Commercial")
- description: string or null
- aspect_ratio: "16:9" | "1:2.35" | "4:3"
- video_url: string or null (Vimeo or YouTube URL)
- credits: { director, colorGrading, gaffer, artDirector, producer, additionalFilming }
- awards: string[] or null
- festival: string or null (e.g. "Cannes Film Festival")
- order_index: number

Current works will be provided. Return ONLY a JSON object with this exact structure:
{
  "action": "create" | "update" | "delete" | "none",
  "workSlug": "existing-work-slug",
  "fields": { ...fields to set },
  "message": "Human-readable confirmation"
}`;

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const prompt = parsePromptBody(body);
  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  const { data: worksData } = await supabase
    .from('works')
    .select('*')
    .order('order_index');
  const currentWorks = validateWorks(worksData ?? []);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let aiAction: AiAction;
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Current works:\n${JSON.stringify(currentWorks, null, 2)}\n\nUser request: ${prompt}`,
        },
      ],
    });

    const content = message.content[0];
    if (content === undefined || content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected AI response type' }, { status: 500 });
    }

    const parsed = parseAiResponse(content.text);
    if (!parsed) {
      return NextResponse.json({ error: 'Could not parse AI response' }, { status: 500 });
    }
    aiAction = parsed;
  } catch (err) {
    console.error('AI error:', err);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }

  if (aiAction.action === 'create' && aiAction.fields) {
    const fields = aiAction.fields;
    const title = typeof fields.title === 'string' ? fields.title : 'Untitled';
    const slug = typeof fields.slug === 'string' ? fields.slug : slugify(title);

    const { error } = await supabase.from('works').insert({
      title,
      slug,
      type: typeof fields.type === 'string' ? fields.type : 'Short film',
      description: typeof fields.description === 'string' ? fields.description : null,
      aspect_ratio: isAspectRatio(fields.aspectRatio) ? fields.aspectRatio : '16:9',
      video_url: typeof fields.videoUrl === 'string' ? fields.videoUrl : null,
      credits: fields.credits ?? {},
      awards: Array.isArray(fields.awards) ? fields.awards : null,
      festival: typeof fields.festival === 'string' ? fields.festival : null,
      media: [],
      order_index: typeof fields.orderIndex === 'number' ? fields.orderIndex : currentWorks.length,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (aiAction.action === 'update' && aiAction.workSlug && aiAction.fields) {
    const fields = aiAction.fields;
    const updateData: Partial<WorkInsert> = {};

    if (typeof fields.title === 'string') updateData.title = fields.title;
    if (typeof fields.type === 'string') updateData.type = fields.type;
    if (typeof fields.description === 'string') updateData.description = fields.description;
    if (isAspectRatio(fields.aspectRatio)) updateData.aspect_ratio = fields.aspectRatio;
    if (typeof fields.videoUrl === 'string') updateData.video_url = fields.videoUrl;
    if (fields.credits) updateData.credits = fields.credits;
    if (Array.isArray(fields.awards)) updateData.awards = fields.awards;
    if (typeof fields.festival === 'string') updateData.festival = fields.festival;
    if (typeof fields.orderIndex === 'number') updateData.order_index = fields.orderIndex;

    const { error } = await supabase
      .from('works')
      .update(updateData)
      .eq('slug', aiAction.workSlug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (aiAction.action === 'delete' && aiAction.workSlug) {
    const { data: target } = await supabase
      .from('works')
      .select('id')
      .eq('slug', aiAction.workSlug)
      .single();

    if (target) {
      const { error } = await supabase.from('works').delete().eq('slug', aiAction.workSlug);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ message: aiAction.message, action: aiAction.action });
}
