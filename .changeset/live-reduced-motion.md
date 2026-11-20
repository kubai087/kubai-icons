---
"kubai-icons": patch
---

Follow the reduced-motion setting as it changes. Icons used to read `prefers-reduced-motion` once when the runtime loaded, so turning it on or off took effect only after a reload; both the layered and the two-tone runtime now check it each time an icon moves.
