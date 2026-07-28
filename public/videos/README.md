# Drop your MP4s here

Replace these placeholder clips with your real footage, keeping the filenames
(or rename them in `lib/constants.ts` under `VIDEOS`).

| File           | Where it appears            | Suggested aspect | Notes                          |
|----------------|-----------------------------|------------------|--------------------------------|
| `hero.mp4`     | Hero background             | 16:9 landscape   | Muted loop, keep it <8 MB      |
| `story.mp4`    | Final CTA ambient wash      | 16:9 landscape   | Low-key, plays behind text     |
| `showcase.mp4` | Split "making" section      | 4:5 portrait     | Detail / process shots         |

**Optimize before shipping** (roughly halves file size, big Lighthouse win):

```bash
ffmpeg -i input.mov -vcodec libx264 -crf 26 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an hero.mp4
```

Add a `.webm` alongside each `.mp4` for smaller Chrome/Firefox payloads, then
add a second `<source>` in `components/ui/VideoSection.tsx`.
