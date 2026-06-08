# Pilot-bootstrap — 5 steg från SQL till första inloggning

Efter att du kört `2026_06_08_pilot_invites.sql` så har du:
- 3 kommuner (Helsingborg, Perstorp, PathfinderAI)
- 4 enheter
- 2 admins (`oliver.mac@pathfinderai.se` = superadmin, `oliver.pettersson2@gmail.com` = handlaggare i Helsingborg)

## Steg 1 — Verifiera i Supabase

I Supabase SQL editor, kör:

```sql
SELECT a.email, a.role, k.name AS kommun, e.name AS enhet
FROM public.admins a
LEFT JOIN public.kommuner k ON k.id = a.kommun_id
LEFT JOIN public.enheter  e ON e.id = a.enhet_id
ORDER BY a.role, a.email;
```

Du ska se 2 rader.

## Steg 2 — Logga in som superadmin

1. Gå till `cvmatchen.com/admin`
2. Logga in med `oliver.mac@pathfinderai.se`
3. Du ska komma in i handläggar-dashboarden, med **alla 3 kommuner** synliga i filtret (eftersom superadmin)

## Steg 3 — Bjud in handläggare till Perstorp

I admin-dashboarden:
1. Gå till "Admins" / "Hantera handläggare"
2. Klicka "Bjud in ny handläggare"
3. Fyll i:
   - Email: `peter.lindow@perstorp.se` (eller deras IT-kontakt)
   - Namn: Peter Lindow
   - Roll: `handlaggare` (eller `kommunadmin` om hen ska kunna bjuda in fler själv)
   - Kommun: Perstorp
   - Enhet: Arbetsmarknadsenheten
4. Systemet genererar `invite_token` — kopiera den

## Steg 4 — Skicka invite-länk

Mejla: `https://cvmatchen.com/admin?invite=<TOKEN>` till handläggaren. När hen klickar och loggar in med samma mejl aktiveras kontot automatiskt.

## Steg 5 — Pilot-deltagare

Pilot-deltagare bjuds in genom att handläggaren delar `cvmatchen.com`-länken + säger åt deltagaren att logga in med sin mejladress.

**Vid första inloggning** triggas onboarding → deltagaren fyller i namn/telefon + godkänner AI-samtycke. När handläggaren senare öppnar sin lista syns deltagaren automatiskt (auto-koppling via Helsingborg/Arbetsmarknadsenheten).

**OBS:** Auto-koppling kräver att deltagarens mejl matchar enhetens regel (eller att handläggaren manuellt mappar via UI:t). För strikt kontroll: använd kommande pending_invites-flöde (kräver hubben).

---

## Roller i admin-systemet

| Roll | Ser | Kan göra |
|---|---|---|
| **superadmin** | Alla kommuner | Allt. Bjuder in kommunadmins, ändrar konfiguration |
| **kommunadmin** | Sin kommun | Bjuda in handläggare i kommunen, se alla enheter |
| **enhetsadmin** | Sin enhet | Bjuda in handläggare till enheten |
| **handlaggare** | Sin enhet | Se sina deltagare, tilldela uppgifter |

## Lägg till ny kommun senare

Som superadmin via SQL (snabbast tills UI byggs):

```sql
INSERT INTO public.kommuner (name, org_nr, is_pilot, pilot_ends)
VALUES ('Landskrona', '212000-1140', true, now() + interval '90 days');

INSERT INTO public.enheter (kommun_id, name)
SELECT id, 'Arbetsmarknadsenheten' FROM public.kommuner WHERE name = 'Landskrona';
```

Sedan bjud in en kommunadmin via UI:t.

## Felsökning

**"Ej inbjuden till CVmatchen"** vid login → din mejl finns inte i `admins`-tabellen. Verifiera med:
```sql
SELECT * FROM public.admins WHERE lower(email) = lower('din@mejl.se');
```

**Handläggaren ser inga deltagare** → kontrollera att deltagarens `user_assignments`-rad har samma `kommun_id`/`enhet_id` som handläggaren. Manuell fix:
```sql
UPDATE public.user_assignments
SET kommun_id = (SELECT id FROM public.kommuner WHERE name = 'Helsingborg'),
    enhet_id  = (SELECT id FROM public.enheter  WHERE name = 'Arbetsmarknadsenheten' LIMIT 1)
WHERE user_id = 'DELTAGARENS_USER_ID';
```
