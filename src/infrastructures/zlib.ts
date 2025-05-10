import compression from "compression"
import { createBrotliCompress } from "zlib"

export const brotliCompression = compression({
  threshold: 1024,
  brotli: {
    zlib: createBrotliCompress,
  },
})
