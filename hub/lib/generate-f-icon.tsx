import { ImageResponse } from "next/og"
import { SITE_URL } from "./consts"

const geistMonoUrl = `${SITE_URL}/geistMono.ttf`

let geistMonoPromise: Promise<ArrayBuffer> | null = null

function loadGeistMono() {
  geistMonoPromise ??= fetch(geistMonoUrl).then((res) => res.arrayBuffer())
  return geistMonoPromise
}

export async function generateFIcon(size: number) {
  const geistMono = await loadGeistMono()

  return new ImageResponse(
    <div
      style={{
        background: "#111111",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: Math.round(size * 0.68),
        fontWeight: 600,
        fontFamily: "Geist Mono",
        borderRadius: "100%",
      }}
    >
      F
    </div>,
    {
      width: size,
      height: size,
      fonts: [
        {
          name: "Geist Mono",
          data: geistMono,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )
}
