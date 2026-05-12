-- Seed data for Shay Ater's portfolio works
-- Run this AFTER the migration in Supabase SQL editor.
-- Images are not included — upload via the admin panel.

INSERT INTO public.works (title, slug, type, aspect_ratio, video_url, credits, awards, festival, media, order_index) VALUES

(
  'It''s Not Time for Pop',
  'its-not-time-for-pop',
  'Short film',
  '16:9',
  'https://vimeo.com/938506554',
  '{"director":"Amit Vaknin","colorGrading":"Itamar Kasirer","gaffer":"Samuel Santcroos"}',
  NULL,
  'Cannes Film Festival, La Cinef competition',
  '[]',
  1
),

(
  'Under the Surface',
  'under-the-surface',
  'Short film',
  '1:2.35',
  NULL,
  '{"director":"Nir Guilat","colorGrading":"Asaf Arviv","gaffer":"Arad Frenkel","artDirector":"Adi Raskin Peled","producer":"Eviatar Moncaz"}',
  NULL,
  NULL,
  '[]',
  2
),

(
  'Mythos',
  'mythos',
  'Short film',
  '16:9',
  'https://www.youtube.com/watch?v=1AG9ra2OIjw',
  '{"director":"Omer Melamed","colorGrading":"Gal Issar","gaffer":"Lior Rubinstein","artDirector":"Natasha Naumova","producer":"Gaya Komm, Gal Zaidman"}',
  NULL,
  'Jerusalem Film Festival (JFF)',
  '[]',
  3
),

(
  'Perfect Scenery',
  'perfect-scenery',
  'Music video',
  '1:2.35',
  'https://www.youtube.com/watch?v=dkL6lk7UH1w',
  '{"director":"Noa Mermelstein and Shay Ater","colorGrading":"Gal Issar","gaffer":"Ira Neuman","artDirector":"Sigal Hananyev","producer":"Maayan Eden"}',
  NULL,
  NULL,
  '[]',
  4
),

(
  'Pompeii',
  'pompeii',
  'Short film',
  '16:9',
  NULL,
  '{"director":"Amit Vaknin","colorGrading":"Itamar Kasirer","gaffer":"Samuel Santcroos","artDirector":"Yuval Grinstein","producer":"Abigaelle Hadad"}',
  NULL,
  'Haifa Film Festival',
  '[]',
  5
),

(
  'A Place That Does Not Exist',
  'a-place-that-does-not-exist',
  'Short film',
  '16:9',
  NULL,
  '{"director":"Tehila Ruddel","colorGrading":"Edit Studios","gaffer":"Fredy Miskin, Tomer Abend","artDirector":"Shirly Lev","producer":"David Fram"}',
  NULL,
  NULL,
  '[]',
  6
),

(
  'Nothing, Maybe',
  'nothing-maybe',
  'Short film',
  '16:9',
  NULL,
  '{"director":"Daniel Gat","colorGrading":"Shira Chait","gaffer":"Elay Simhon","artDirector":"Daniel Gat","producer":"Tamar Peled"}',
  ARRAY['Best Short Film, TLVFest'],
  NULL,
  '[]',
  7
),

(
  'Gemeaux',
  'gemeaux',
  'Short film',
  '16:9',
  NULL,
  '{"director":"Mika Joffe","colorGrading":"Itamar Kasirer","gaffer":"Josh Paloma","artDirector":"Yuval Grinstein"}',
  NULL,
  NULL,
  '[]',
  8
),

(
  'Little Monkey (BABOONA)',
  'little-monkey-baboona',
  'Short film',
  '1:2.35',
  NULL,
  '{"director":"Maya Gadash","colorGrading":"Gal Issar","gaffer":"Ira Neuman","artDirector":"Neta Kanonich","producer":"Gaya Komm"}',
  NULL,
  NULL,
  '[]',
  9
),

(
  'Parents Conference',
  'parents-conference',
  'Short film',
  '16:9',
  NULL,
  '{"director":"Inbal Voitiz Sass","colorGrading":"Alex Deutsch","gaffer":"Lior Rubinstein","artDirector":"Miel Levy","producer":"Noam Yosef"}',
  NULL,
  NULL,
  '[]',
  10
),

(
  'See You ''Round the Block',
  'see-you-round-the-block',
  'Short film',
  '16:9',
  NULL,
  '{"director":"Daniel Gat","colorGrading":"Shira Chait","producer":"Maya Schwarz"}',
  NULL,
  NULL,
  '[]',
  11
),

(
  'Family Distancing',
  'family-distancing',
  'Short film',
  '1:2.35',
  'https://www.youtube.com/watch?v=5NTx8Vi3868',
  '{"director":"Roy Kanevsky","colorGrading":"Itay Batz","gaffer":"Ira Neuman","artDirector":"Tamar Bahar","producer":"Harel Ben Melech"}',
  NULL,
  NULL,
  '[]',
  12
),

(
  'On the Side',
  'on-the-side',
  'Short film',
  '1:2.35',
  'https://vimeo.com/287796350',
  '{"director":"Alma Hemmo","colorGrading":"Opal Perez","gaffer":"Gadi Yampel","artDirector":"Omer Carmelli","producer":"Dean Bendror"}',
  NULL,
  'Warsaw Film Festival',
  '[]',
  13
),

(
  'Tshuva',
  'tshuva',
  'Short film',
  '4:3',
  NULL,
  '{"director":"Afek Testa Launer","colorGrading":"Peleg","gaffer":"Arad Frenkel","artDirector":"Adi Raskin Peled","producer":"Ben Vaknin, Afek Testa Launer","additionalFilming":"Rachel Albert, G Latz"}',
  ARRAY['Best Cinematography, TISFF'],
  NULL,
  '[]',
  14
),

(
  'Echo',
  'echo',
  'Short film',
  '1:2.35',
  'https://vimeo.com/675871645/a616f2b3af',
  '{"director":"Tal Honig","colorGrading":"Shira Chait","gaffer":"Daniel Nieto","artDirector":"Maya Guy, Michal Honig"}',
  NULL,
  NULL,
  '[]',
  15
);
