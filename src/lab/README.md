# src/lab

Everything an experiment needs that the real site doesn't: components,
copies of shared pieces, one-off styles, throwaway assets.

Two rules keep the lab disposable:

1. **Copy, don't edit.** If an experiment needs to change the nav, the pill
   styles, or the project page template, copy the file here and change the
   copy. Editing the original means the experiment can't be unpicked later —
   that's the one way a lab can damage the real site.

2. **Nothing outside this folder and `src/routes/lab.tsx`.** If that holds,
   deleting the branch deletes every trace of the experiments.

This folder only exists on the `lab` branch. It is never merged to `main` as
a whole — if something works, that one piece gets moved over deliberately.
