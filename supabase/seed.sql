-- =============================================================================
-- PagLaafi — Données initiales
--
-- ⚠️ Données de DÉMONSTRATION NON VÉRIFIÉES (statuts, tarifs, contacts,
-- traductions), reprises de l'application. Elles sont insérées avec
-- verifie = false : elles restent MASQUÉES en mode réel tant que le superadmin
-- ne les a pas vérifiées auprès des structures (replit.md : ne jamais inventer
-- de centres, contacts ou tarifs).
--
-- Exécution : pnpm run db:migrer -- --seed (une seule fois, sur une base vide).
-- =============================================================================

insert into public.centres (
  nom, nom_court, lieu, ville, adresse, telephone, lat, lng, statut, statut_libelle, appareil,
  appareil_fonctionnel, agents_presents, description_personnel, file_attente, attente_estimee,
  examens, visites_confirmees_jour,
  message_audio_fr, message_audio_en, message_audio_moore, message_audio_dioula,
  verifie
)
select * from (values
  ('CMA de Schiphra (Centre Médical avec Antenne Chirurgicale)', 'CMA Schiphra', 'Tanghin, Secteur 17, Ouagadougou', 'Ouagadougou', 'Tanghin, Arrondissement 4 (ex-Secteur 30), Ouagadougou', '+226 25 36 30 70', 12.405, -1.518, 'available'::public.statut_centre, 'Disponible · Attente fluide', 'Mammographe numérique Hologic opérationnel', true, 4, '2 sages-femmes, 1 radiologue, 1 technicienne radio', 8, '~15 à 20 min',
   '[{"name":"Palpation clinique mammaire","price":0,"free":true,"notes":"Dépistage gratuit tous les matins"},{"name":"Échographie mammaire bilatérale","price":6000,"free":false},{"name":"Mammographie numérique","price":12000,"free":false,"notes":"Résultats en 48h"}]'::jsonb, 48,
   'Bonjour, ici la sage-femme de Schiphra. Notre mammographe fonctionne parfaitement aujourd''hui. L''attente est faible, moins de 20 minutes.',
   'Hello, this is the midwife from Schiphra. Our digital mammography unit is fully functional today with minimal wait time (under 20 minutes).',
   'Ne y beogo pagbã fãa, CMA Schiphra tɩɩm zĩiga yaa kaset. Masã masã, mammographie masĩnã tʋmdame tɩ zĩigã pa noom ye. Wa-y laafi.',
   'Aw ni sɔgɔma, CMA Schiphra kɛnɛyaso la masin bɛ baara kɛ kosɛbɛ bi. Mɔgɔ caman t''a la, aw bɛ se ka na sisan.',
   false),
  ('Centre Hospitalier Universitaire de Bogodogo (CHU-B)', 'CHU Bogodogo', 'Secteur 24, Ouagadougou', 'Ouagadougou', 'Boulevard des Tansoba, Arrondissement 5, Ouagadougou', '+226 25 37 40 40', 12.338, -1.488, 'busy'::public.statut_centre, 'Forte affluence · Prévoir attente', 'Mammographe opérationnel (2 appareils sur 2)', true, 6, '3 radiologues en poste, 3 sages-femmes', 46, '~1h15 à 1h30',
   '[{"name":"Examen clinique & sensibilisation","price":0,"free":true,"notes":"Prise en charge Octobre Rose"},{"name":"Échographie mammaire haute résolution","price":7500,"free":false},{"name":"Mammographie de dépistage","price":10000,"free":false},{"name":"Micro-biopsie guidée","price":25000,"free":false}]'::jsonb, 76,
   'Au CHU de Bogodogo, les deux appareils fonctionnent mais nous avons une forte affluence ce matin. Privilégiez le début d''après-midi.',
   'At Bogodogo University Hospital, both machines are operational but there is heavy attendance this morning. Early afternoon is recommended.',
   'CHU Bogodogo tʋmdame, la neb wʋsg n be kãenkãenga rũnda. Bɩ y bãng tɩ zãama nooma, sã n yaa ne yãmb yaa sõma tɩ y wa zaabre.',
   'CHU Bogodogo masinw bɛ baara kɛ, nka mɔgɔw ka ca bi. Ni aw bɛ fɛ, aw bɛ se ka na wula fɛ.',
   false),
  ('CHU Sourô Sanou (CHUSS) — Service Gynécologie', 'CHU Sourô Sanou', 'Centre-Ville, Bobo-Dioulasso', 'Bobo-Dioulasso', 'Avenue de la République, Bobo-Dioulasso', '+226 20 97 00 44', 11.178, -4.295, 'available'::public.statut_centre, 'Disponible · Équipe complète', 'Mammographe et échographe opérationnels', true, 5, '2 gynécologues, 3 sages-femmes dédiées', 12, '~25 min',
   '[{"name":"Auto-palpation guidée & Examen clinique","price":0,"free":true},{"name":"Échographie mammaire","price":7000,"free":false},{"name":"Mammographie numérique","price":12000,"free":false}]'::jsonb, 52,
   'Bonjour aux femmes de Bobo. Le service de dépistage est ouvert en continu jusqu''à 16 heures. L''équipe est au complet et prête à vous orienter.',
   'Hello to all women in Bobo-Dioulasso. Our screening unit is open continuously until 4 PM with complete medical staff.',
   'Bobo CHU Sourô Sanou pʋgẽ, b sɩngame tɩ b gũusd pagbã ne laafi. Ned baa a yembre pa be n gũud wʋsg ye. Wa-y tɩ b ges yãmba.',
   'I ni sɔgɔma Bobo musow. CHU Sourô Sanou dayɛlɛn bɛ fo ka taga se lere naani wula fɛ. Dɔgɔtɔrɔmusow bɛ yan k''aw bisimila.',
   false),
  ('Centre Hospitalier Régional (CHR) de Koudougou', 'CHR Koudougou', 'Secteur 1, Koudougou', 'Koudougou', 'Route de Ouagadougou, Secteur 1, Koudougou', '+226 25 44 01 24', 12.251, -2.366, 'maintenance'::public.statut_centre, 'Appareil en maintenance technique', 'Mammographe en révision (pièce attendue ce soir)', false, 2, '2 sages-femmes assurant les examens cliniques manuels', 3, '~10 min (Clinique uniquement)',
   '[{"name":"Palpation clinique manuelle","price":0,"free":true,"notes":"Maintenue normalement"},{"name":"Mammographie","price":10000,"free":false,"notes":"🔴 Suspendue aujourd''hui"}]'::jsonb, 19,
   'Attention pour le CHR de Koudougou : le mammographe est en maintenance. Les sages-femmes assurent la palpation manuelle gratuite.',
   'Notice for Koudougou Regional Hospital: mammography machine is under maintenance today. Manual clinical breast examinations remain open.',
   'CHR Koudougou: Masĩnã komsame bilfu tɩ b ket n manegda. La pagbã tõe n waame tɩ b ning-b nus n ges b yĩnsa zaalem.',
   'Koudougou CHR masin tiɲɛna dɔɔni bi. Musow bɛ se ka na dɔgɔtɔrɔmusow bɛ bɔlɔkɔrɔ lajɛ kɛ.',
   false),
  ('Centre Médical Urbain (CMU) Secteur 22', 'CMU Secteur 22', 'Tampouy, Ouagadougou', 'Ouagadougou', 'Tampouy, Arrondissement 3, Ouagadougou', '+226 25 35 12 00', 12.392, -1.554, 'outdated'::public.statut_centre, 'Non actualisé aujourd''hui', 'Statut non confirmé ce matin', false, 0, 'Rapport journalier non validé', 0, 'Inconnue',
   '[{"name":"Consultation d''orientation","price":1000,"free":false},{"name":"Palpation clinique","price":0,"free":true}]'::jsonb, 5,
   'Ce centre n''a pas encore validé son rapport ce matin. Veuillez appeler le centre avant de vous déplacer.',
   'This medical center has not confirmed daily status yet. Please call beforehand.',
   'Kasetã pa paam kʋdemd sebr rũnda ye. Bɩ y tẽeg n bãng bãmb sã n sɩngame tɩ y yaool n ta.',
   'Kɛnɛyaso nin ma kuma fɔ bi fɔlɔ. Aw k''u weele telefone fɛ k''a lɔn sani aw ka taga.',
   false)
) as v
where not exists (select 1 from public.centres);

insert into public.associations (nom, sigle, mission, ville, beneficiaires, verifiee)
select * from (values
  ('BE NEERE FOR CAUSE', 'BE NEERE', 'Organisation burkinabè pionnière : cliniques mobiles de dépistage gratuit, sensibilisation de proximité et prise en charge des femmes en milieu rural et périurbain.', 'Ouagadougou, Bobo & Centre-Nord', '2 800 femmes dépistées et accompagnées', false),
  ('WOMENTECHMAKERS & ORANGE DIGITAL CENTER', 'WTM / ODC', 'Synergie d''innovation numérique et sociale : développement de solutions e-santé locales, vulgarisation technologique contre le cancer et ateliers de sensibilisation pour les femmes.', 'Ouagadougou & Bobo-Dioulasso', '1 950 femmes formées et orientées', false),
  ('GENIT CARE BURKINA', 'GENIT CARE', 'Centre de référence en santé génésique de la femme : consultations gynécologiques bienveillantes, dépistage précoce, bilans sénologiques et prise en charge de l''endométriose.', 'Ouagadougou', '3 200 examens et bilans réalisés', false),
  ('Fonds de Solidarité Patientes — CMA de Schiphra', 'Fonds Schiphra', 'Subvention immédiate des mammographies, échographies et biopsies pour les patientes démunies adressées avec fiche d''orientation.', 'Ouagadougou (Tanghin)', '620 examens pris en charge', false),
  ('Association Burkinabè d''Action contre le Cancer', 'ABAC', 'Sensibilisation communautaire et plaidoyer pour l''accès universel aux traitements oncologiques au Burkina Faso.', 'Ouagadougou', '1 450 femmes touchées', false)
) as v
where not exists (select 1 from public.associations);
