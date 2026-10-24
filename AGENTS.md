# Project decisions

- Auth is optional by design: every lab tool (resume scan, classify, keyboard, agents, chat, JSON/TOON studio, RAG) must work for signed-out visitors. Sign-in exists only to save and view history in My Lab. Edge functions must never reject requests for missing/invalid JWT — treat them as anonymous. Why: the owner chose "make login optional"; a previous hard JWT requirement caused 401s for signed-out users.
- History is saved only when a session exists: components insert into the *_history tables only if a user is signed in (RLS scopes rows to auth.uid()). My Lab reads history only for signed-in users and shows a friendly prompt otherwise. Why: keeps RLS intact instead of making history public.
- All AI edge functions call the Lovable AI Gateway with the project LOVABLE_API_KEY; if the gateway reports the key is not registered, rotate the key instead of switching providers.
