"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { QRCode } from "react-qrcode-logo"

interface BusinessQRCodeProps {
  value: string
  size?: number
  qrStyle?: "squares" | "dots" | "fluid"
  eyeRadius?: number
  logoImage?: string
  logoWidth?: number
  logoHeight?: number
  logoBorderRadius?: number
  logoPadding?: number
  ecLevel?: "L" | "M" | "Q" | "H"
  quietZone?: number
  bgColor?: string
  fgColor?: string
  fallbackLogo?: string
}

/**
 * Renders a business QR code where the center business logo always has a soft
 * border radius (squircle/rounded-2xl aesthetic), proper aspect-ratio cover
 * cropping, and clean QR module clearance around its rounded corners.
 */
export function BusinessQRCode({
  value,
  size = 240,
  qrStyle = "dots",
  eyeRadius = 10,
  logoImage = "/logo.png",
  logoWidth,
  logoHeight,
  logoBorderRadius,
  logoPadding,
  ecLevel = "H",
  quietZone = 10,
  bgColor = "#FFFFFF",
  fgColor = "#000000",
  fallbackLogo = "/logo.png",
}: BusinessQRCodeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const effectiveWidth = logoWidth ?? Math.round(size * 0.3)
  const effectiveHeight = logoHeight ?? effectiveWidth
  // Soft ~22% border radius relative to logo size (e.g. ~16px on 75px, ~22px on 100px, ~33px on 150px)
  const effectiveRadius =
    logoBorderRadius ?? Math.round(Math.min(effectiveWidth, effectiveHeight) * 0.22)
  const effectivePadding =
    logoPadding ?? Math.max(4, Math.round(Math.min(effectiveWidth, effectiveHeight) * 0.05))

  const [processedLogo, setProcessedLogo] = useState<string>(logoImage || fallbackLogo)

  useEffect(() => {
    let isCancelled = false
    const targetSrc = logoImage || fallbackLogo

    const renderRoundedLogo = (img: HTMLImageElement): string | null => {
      try {
        const canvasSize = 256
        const radius = Math.round(canvasSize * 0.22)
        const offscreen = document.createElement("canvas")
        offscreen.width = canvasSize
        offscreen.height = canvasSize
        const ctx = offscreen.getContext("2d")
        if (!ctx) return null

        ctx.clearRect(0, 0, canvasSize, canvasSize)

        // Clip to soft rounded rectangle
        ctx.save()
        ctx.beginPath()
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(0, 0, canvasSize, canvasSize, radius)
        } else {
          ctx.rect(0, 0, canvasSize, canvasSize)
        }
        ctx.closePath()
        ctx.clip()

        // Solid white base behind transparent logos
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvasSize, canvasSize)

        // Draw image using object-fit: cover math so rectangular logos aren't stretched
        const iw = img.naturalWidth || img.width || canvasSize
        const ih = img.naturalHeight || img.height || canvasSize
        const scale = Math.max(canvasSize / iw, canvasSize / ih)
        const dw = iw * scale
        const dh = ih * scale
        const dx = (canvasSize - dw) / 2
        const dy = (canvasSize - dh) / 2
        ctx.drawImage(img, dx, dy, dw, dh)
        ctx.restore()

        // Subtle soft border ring around the rounded logo
        ctx.save()
        ctx.beginPath()
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(1.5, 1.5, canvasSize - 3, canvasSize - 3, radius - 1)
        }
        ctx.strokeStyle = "rgba(15, 23, 42, 0.08)"
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.restore()

        return offscreen.toDataURL("image/png")
      } catch {
        return null
      }
    }

    const loadAndProcess = (src: string, allowFallback: boolean) => {
      const img = new Image()
      if (!src.startsWith("data:")) {
        img.crossOrigin = "anonymous"
      }
      img.onload = () => {
        if (isCancelled) return
        const dataUrl = renderRoundedLogo(img)
        setProcessedLogo(dataUrl || src)
      }
      img.onerror = () => {
        if (isCancelled) return
        if (allowFallback && src !== fallbackLogo) {
          loadAndProcess(fallbackLogo, false)
        } else {
          setProcessedLogo(fallbackLogo)
        }
      }
      img.src = src
    }

    loadAndProcess(targetSrc, true)

    return () => {
      isCancelled = true
    }
  }, [logoImage, fallbackLogo, bgColor])

  // Defense-in-depth: also apply even-odd corner masking directly on the QR canvas
  // after react-qrcode-logo draws the logo image so corners are always softly rounded.
  const handleLogoOnLoad = useCallback(() => {
    const canvas = wrapperRef.current?.querySelector("canvas")
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx || typeof ctx.roundRect !== "function") return

    const dxLogo = (size - effectiveWidth) / 2 + quietZone
    const dyLogo = (size - effectiveHeight) / 2 + quietZone

    ctx.save()
    ctx.beginPath()
    // Outer rectangle covering the 4 sharp corners
    ctx.rect(dxLogo - 1.5, dyLogo - 1.5, effectiveWidth + 3, effectiveHeight + 3)
    // Inner rounded rectangle cutout
    ctx.roundRect(dxLogo, dyLogo, effectiveWidth, effectiveHeight, effectiveRadius)
    ctx.fillStyle = bgColor
    ctx.fill("evenodd")

    // Soft subtle border around the rounded logo
    ctx.beginPath()
    ctx.roundRect(
      dxLogo + 0.5,
      dyLogo + 0.5,
      effectiveWidth - 1,
      effectiveHeight - 1,
      effectiveRadius
    )
    ctx.strokeStyle = "rgba(15, 23, 42, 0.08)"
    ctx.lineWidth = 1.25
    ctx.stroke()
    ctx.restore()
  }, [size, effectiveWidth, effectiveHeight, quietZone, effectiveRadius, bgColor])

  return (
    <div ref={wrapperRef} className="inline-flex items-center justify-center">
      <QRCode
        value={value}
        size={size}
        quietZone={quietZone}
        bgColor={bgColor}
        fgColor={fgColor}
        qrStyle={qrStyle}
        eyeRadius={eyeRadius}
        logoImage={processedLogo}
        logoWidth={effectiveWidth}
        logoHeight={effectiveHeight}
        logoPadding={effectivePadding}
        logoPaddingStyle="square"
        logoPaddingRadius={effectiveRadius + effectivePadding}
        removeQrCodeBehindLogo={true}
        ecLevel={ecLevel}
        logoOnLoad={handleLogoOnLoad}
      />
    </div>
  )
}
