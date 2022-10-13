import {
  AddEquation,
  CustomBlending,
  DstAlphaFactor,
  DstColorFactor,
  NoBlending,
  ShaderMaterial,
  Texture,
  UniformsUtils,
  ZeroFactor
} from 'three'
import { FullScreenQuad, Pass } from 'three/examples/jsm/postprocessing/Pass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { InputColorTextureUniform, SpecklePass } from './SpecklePass'

export class ApplySAOPass extends Pass implements SpecklePass {
  private fsQuad: FullScreenQuad
  public materialCopy: ShaderMaterial

  constructor() {
    super()
    this.materialCopy = new ShaderMaterial({
      uniforms: UniformsUtils.clone(CopyShader.uniforms),
      vertexShader: CopyShader.vertexShader,
      fragmentShader: CopyShader.fragmentShader,
      blending: NoBlending
    })
    this.materialCopy.transparent = true
    this.materialCopy.depthTest = false
    this.materialCopy.depthWrite = false
    this.materialCopy.blending = CustomBlending
    this.materialCopy.blendSrc = DstColorFactor
    this.materialCopy.blendDst = ZeroFactor
    this.materialCopy.blendEquation = AddEquation
    this.materialCopy.blendSrcAlpha = DstAlphaFactor
    this.materialCopy.blendDstAlpha = ZeroFactor
    this.materialCopy.blendEquationAlpha = AddEquation

    this.materialCopy.needsUpdate = true
    this.fsQuad = new FullScreenQuad(this.materialCopy)
  }

  public setTexture(uName: InputColorTextureUniform, texture: Texture) {
    this.materialCopy.uniforms[uName].value = texture
    this.materialCopy.needsUpdate = true
  }

  get displayName(): string {
    return 'APPLYSAO'
  }

  get outputTexture(): Texture {
    return null
  }

  setParams(params: unknown) {
    params
  }

  render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive*/) {
    writeBuffer
    readBuffer
    renderer.setRenderTarget(null)
    const rendereAutoClear = renderer.autoClear
    renderer.autoClear = false
    this.fsQuad.render(renderer)
    renderer.autoClear = rendereAutoClear
  }
}
