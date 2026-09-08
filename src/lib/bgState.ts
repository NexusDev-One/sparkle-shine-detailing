/**
 * Shared mutable state bridging DOM interactions and the WebGL background.
 * The background canvas reads this every frame; sections write targets.
 */
export interface BgParams {
  warp: number; // surface bend / stretch
  trails: number; // blue light trails
  water: number; // water ripple distortion
  drops: number; // droplet glints
  parts: number; // depth particles flying toward camera
  metal: number; // metallic reflection bands
  dark: number; // global darkening (finale)
  sweep: number; // sweeping beam intensity
  bloom: number; // focus glow (form interaction)
}

export const DEFAULT_PARAMS: BgParams = {
  warp: 0.12,
  trails: 0.05,
  water: 0.08,
  drops: 0.3,
  parts: 0.05,
  metal: 0.45,
  dark: 0.05,
  sweep: 0,
  bloom: 0,
};

export const bgState = {
  /** 0..1 total page scroll progress — written by App scroll loop */
  progress: 0,
  /** smoothed scroll velocity */
  velocity: 0,
  /** smoothed pointer position -1..1 */
  mx: 0,
  my: 0,
  /** pointer targets */
  tx: 0,
  ty: 0,
  /** transient section override (immersive / showcase stages) */
  override: null as Partial<BgParams> | null,
  /** form focus boost 0..1 */
  focusBoost: 0,
};
