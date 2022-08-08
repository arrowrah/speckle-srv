import { Color, DoubleSide, Material, MathUtils, Texture, Vector2 } from 'three'
import { GeometryType } from '../batching/Batch'
// import { getConversionFactor } from '../converter/Units'
import { TreeNode } from '../tree/WorldTree'
import { DisplayStyle, NodeRenderView, RenderMaterial } from '../tree/NodeRenderView'
import SpeckleLineMaterial from './SpeckleLineMaterial'
import SpeckleStandardMaterial from './SpeckleStandardMaterial'
import SpecklePointMaterial from './SpecklePointMaterial'
import { FilterMaterialType } from '../FilteringManager'
import SpeckleStandardColoredMaterial from './SpeckleStandardColoredMaterial'
import defaultGradient from '../../assets/gradient.png'
import { Assets } from '../Assets'
import { FilterMaterial } from '../FilteringManager'
import { getConversionFactor } from '../converter/Units'

export interface MaterialOptions {
  rampIndex?: number
  rampIndexColor?: Color
  rampTexture?: Texture
}

export default class Materials {
  private readonly materialMap: { [hash: number]: Material } = {}
  private meshHighlightMaterial: Material = null
  private meshGhostMaterial: Material = null
  private lineHighlightMaterial: Material = null
  private lineGhostMaterial: Material = null
  private lineColoredMaterial: Material = null
  private pointCloudHighlightMaterial: Material = null
  private pointHighlightMaterial: Material = null
  private pointGhostMaterial: Material = null
  private meshGradientMaterial: Material = null
  private meshColoredMaterial: Material = null
  private meshHiddenMaterial: Material = null
  private lineHiddenMaterial: Material = null

  public static renderMaterialFromNode(node: TreeNode): RenderMaterial {
    if (!node) return null
    let renderMaterial: RenderMaterial = null
    if (node.model.raw.renderMaterial) {
      renderMaterial = {
        id: node.model.raw.renderMaterial.id,
        color: node.model.raw.renderMaterial.diffuse,
        opacity: node.model.raw.renderMaterial.opacity
          ? node.model.raw.renderMaterial.opacity
          : 1,
        vertexColors: node.model.raw.colors && node.model.raw.colors.length > 0
      }
    }
    return renderMaterial
  }

  public static displayStyleFromNode(node: TreeNode): DisplayStyle {
    if (!node) return null
    let displayStyle: DisplayStyle = null
    if (node.model.raw.displayStyle) {
      /** If there are no units specified, we ignore the line width value */
      let lineWeight = node.model.raw.displayStyle.lineweight || 0
      const units = node.model.raw.displayStyle.units
      lineWeight = units ? lineWeight * getConversionFactor(units) : 0
      displayStyle = {
        id: node.model.raw.displayStyle.id,
        color: node.model.raw.displayStyle.diffuse || node.model.raw.displayStyle.color,
        lineWeight
      }
    } else if (node.model.raw.renderMaterial) {
      displayStyle = {
        id: node.model.raw.renderMaterial.id,
        color: node.model.raw.renderMaterial.diffuse,
        lineWeight: 0
      }
    }
    return displayStyle
  }

  public async createDefaultMaterials() {
    this.meshHighlightMaterial = new SpeckleStandardMaterial(
      {
        color: 0xff0000,
        emissive: 0x0,
        roughness: 1,
        metalness: 0,
        side: DoubleSide // TBD
        // clippingPlanes: this.viewer.sectionBox.planes
      },
      ['USE_RTE']
    )

    this.lineHighlightMaterial = new SpeckleLineMaterial({
      color: 0x7f7fff,
      linewidth: 1, // in world units with size attenuation, pixels otherwise
      worldUnits: false,
      vertexColors: true,
      alphaToCoverage: false,
      resolution: new Vector2()
      // clippingPlanes: this.viewer.sectionBox.planes
    })
    ;(<SpeckleLineMaterial>this.lineHighlightMaterial).color = new Color(0x7f7fff)
    ;(<SpeckleLineMaterial>this.lineHighlightMaterial).linewidth = 1
    ;(<SpeckleLineMaterial>this.lineHighlightMaterial).worldUnits = false
    ;(<SpeckleLineMaterial>this.lineHighlightMaterial).vertexColors = true
    ;(<SpeckleLineMaterial>this.lineHighlightMaterial).pixelThreshold = 0.5
    ;(<SpeckleLineMaterial>this.lineHighlightMaterial).resolution = new Vector2()

    this.lineGhostMaterial = new SpeckleLineMaterial({
      color: 0xffffff,
      linewidth: 1, // in world units with size attenuation, pixels otherwise
      worldUnits: false,
      vertexColors: true,
      alphaToCoverage: false,
      resolution: new Vector2()
      // clippingPlanes: this.viewer.sectionBox.planes
    })
    ;(<SpeckleLineMaterial>this.lineGhostMaterial).color = new Color(0xffffff)
    ;(<SpeckleLineMaterial>this.lineGhostMaterial).linewidth = 1
    ;(<SpeckleLineMaterial>this.lineGhostMaterial).worldUnits = true
    ;(<SpeckleLineMaterial>this.lineGhostMaterial).vertexColors = true
    ;(<SpeckleLineMaterial>this.lineGhostMaterial).pixelThreshold = 0.5
    ;(<SpeckleLineMaterial>this.lineGhostMaterial).resolution = new Vector2()

    this.lineColoredMaterial = new SpeckleLineMaterial({
      color: 0xffffff,
      linewidth: 1, // in world units with size attenuation, pixels otherwise
      worldUnits: false,
      vertexColors: true,
      alphaToCoverage: false,
      resolution: new Vector2()
      // clippingPlanes: this.viewer.sectionBox.planes
    })
    ;(<SpeckleLineMaterial>this.lineColoredMaterial).color = new Color(0xffffff)
    ;(<SpeckleLineMaterial>this.lineColoredMaterial).linewidth = 1
    ;(<SpeckleLineMaterial>this.lineColoredMaterial).worldUnits = false
    ;(<SpeckleLineMaterial>this.lineColoredMaterial).vertexColors = true
    ;(<SpeckleLineMaterial>this.lineColoredMaterial).pixelThreshold = 0.5
    ;(<SpeckleLineMaterial>this.lineColoredMaterial).resolution = new Vector2()

    this.pointCloudHighlightMaterial = new SpecklePointMaterial({
      color: 0xff0000,
      vertexColors: true,
      size: 2,
      sizeAttenuation: false
      // clippingPlanes: this.viewer.sectionBox.planes
    })

    this.pointHighlightMaterial = new SpecklePointMaterial({
      color: 0xff0000,
      vertexColors: false,
      size: 2,
      sizeAttenuation: false
      // clippingPlanes: this.viewer.sectionBox.planes
    })

    this.pointGhostMaterial = new SpecklePointMaterial({
      color: 0xffffff,
      vertexColors: false,
      size: 2,
      opacity: 0.01,
      sizeAttenuation: false
      // clippingPlanes: this.viewer.sectionBox.planes
    })

    this.meshGhostMaterial = new SpeckleStandardMaterial(
      {
        color: 0xffffff,
        // side: DoubleSide,
        transparent: true,
        opacity: 0.2,
        wireframe: false
      },
      ['USE_RTE']
    )
    this.meshGhostMaterial.depthWrite = false

    this.meshGradientMaterial = new SpeckleStandardColoredMaterial(
      {
        side: DoubleSide,
        transparent: false,
        opacity: 1,
        wireframe: false
      },
      ['USE_RTE']
    )
    ;(this.meshGradientMaterial as SpeckleStandardColoredMaterial).setGradientTexture(
      await Assets.getTexture(defaultGradient)
    )

    this.meshColoredMaterial = new SpeckleStandardColoredMaterial(
      {
        side: DoubleSide,
        transparent: false,
        opacity: 1,
        wireframe: false
      },
      ['USE_RTE']
    )

    this.meshHiddenMaterial = new SpeckleStandardMaterial(
      {
        side: DoubleSide,
        transparent: false,
        opacity: 1,
        wireframe: false
      },
      ['USE_RTE']
    )
    this.meshHiddenMaterial.visible = false

    this.lineHiddenMaterial = new SpeckleLineMaterial({
      color: 0xffffff,
      linewidth: 1, // in world units with size attenuation, pixels otherwise
      worldUnits: false,
      vertexColors: true,
      alphaToCoverage: false,
      resolution: new Vector2()
      // clippingPlanes: this.viewer.sectionBox.planes
    })
    ;(<SpeckleLineMaterial>this.lineHiddenMaterial).color = new Color(0xff0000)
    ;(<SpeckleLineMaterial>this.lineHiddenMaterial).linewidth = 1
    ;(<SpeckleLineMaterial>this.lineHiddenMaterial).worldUnits = false
    ;(<SpeckleLineMaterial>this.lineHiddenMaterial).vertexColors = true
    ;(<SpeckleLineMaterial>this.lineHiddenMaterial).pixelThreshold = 0.5
    ;(<SpeckleLineMaterial>this.lineHiddenMaterial).resolution = new Vector2()
    this.lineHiddenMaterial.visible = false

    this.materialMap[NodeRenderView.NullRenderMaterialHash] =
      new SpeckleStandardMaterial(
        {
          color: 0x7f7f7f,
          emissive: 0x0,
          roughness: 1,
          metalness: 0,
          side: DoubleSide // TBD,
          // clippingPlanes: this.viewer.sectionBox.planes
        },
        ['USE_RTE']
      )
    this.materialMap[NodeRenderView.NullRenderMaterialVertexColorsHash] =
      new SpeckleStandardMaterial(
        {
          color: 0x7f7f7f,
          emissive: 0x0,
          roughness: 1,
          metalness: 0,
          side: DoubleSide, // TBD
          vertexColors: true
          // clippingPlanes: this.viewer.sectionBox.planes
        },
        ['USE_RTE']
      )

    const hash = NodeRenderView.NullDisplayStyleHash // So prettier doesn't fuck up everything
    this.materialMap[hash] = new SpeckleLineMaterial({
      color: 0x7f7f7f,
      linewidth: 1, // in world units with size attenuation, pixels otherwise
      worldUnits: false,
      vertexColors: true,
      alphaToCoverage: false,
      resolution: new Vector2()
      // clippingPlanes: this.viewer.sectionBox.planes
    })
    ;(<SpeckleLineMaterial>this.materialMap[hash]).color = new Color(0x7f7f7f)
    ;(<SpeckleLineMaterial>this.materialMap[hash]).linewidth = 1
    ;(<SpeckleLineMaterial>this.materialMap[hash]).worldUnits = false
    ;(<SpeckleLineMaterial>this.materialMap[hash]).vertexColors = true
    ;(<SpeckleLineMaterial>this.materialMap[hash]).pixelThreshold = 0.5
    ;(<SpeckleLineMaterial>this.materialMap[hash]).resolution = new Vector2()

    this.materialMap[NodeRenderView.NullPointMaterialHash] = new SpecklePointMaterial({
      color: 0x7f7f7f,
      vertexColors: false,
      size: 2,
      sizeAttenuation: false
      // clippingPlanes: this.viewer.sectionBox.planes
    })
    this.materialMap[NodeRenderView.NullPointCloudVertexColorsMaterialHash] =
      new SpecklePointMaterial({
        color: 0xffffff,
        vertexColors: true,
        size: 2,
        sizeAttenuation: false
        // clippingPlanes: this.viewer.sectionBox.planes
      })
    this.materialMap[NodeRenderView.NullPointCloudMaterialHash] =
      new SpecklePointMaterial({
        color: 0xffffff,
        vertexColors: false,
        size: 2,
        sizeAttenuation: false
        // clippingPlanes: this.viewer.sectionBox.planes
      })
  }

  private makeMeshMaterial(materialData: RenderMaterial): Material {
    const mat = new SpeckleStandardMaterial(
      {
        color: materialData.color,
        emissive: 0x0,
        roughness: 1,
        metalness: 0,
        opacity: materialData.opacity,
        side: DoubleSide // TBD
        // clippingPlanes: this.viewer.sectionBox.planes
      },
      ['USE_RTE']
    )
    mat.vertexColors = materialData.vertexColors
    mat.transparent = mat.opacity < 1 ? true : false
    mat.depthWrite = mat.transparent ? false : true
    mat.color.convertSRGBToLinear()
    return mat
  }

  private makeLineMaterial(materialData: DisplayStyle): Material {
    const mat: SpeckleLineMaterial = new SpeckleLineMaterial({
      color: materialData.color,
      linewidth: materialData.lineWeight > 0 ? materialData.lineWeight : 1,
      worldUnits: materialData.lineWeight > 0 ? true : false,
      vertexColors: true,
      alphaToCoverage: false,
      resolution: new Vector2()
    })
    mat.color = new Color(materialData.color)
    mat.linewidth = materialData.lineWeight > 0 ? materialData.lineWeight : 1
    mat.worldUnits = materialData.lineWeight > 0 ? true : false
    mat.vertexColors = true
    mat.pixelThreshold = 0.5
    mat.resolution = new Vector2()

    return mat
  }

  private makePointMaterial(materialData: RenderMaterial): Material {
    const mat = new SpecklePointMaterial({
      color: materialData.color,
      opacity: materialData.opacity,
      vertexColors: false,
      size: 2,
      sizeAttenuation: false
      // clippingPlanes: this.viewer.sectionBox.planes
    })
    mat.transparent = mat.opacity < 1 ? true : false
    mat.depthWrite = mat.transparent ? false : true
    mat.color.convertSRGBToLinear()
    return mat
  }

  public updateMaterialMap(
    hash: number,
    material: RenderMaterial | DisplayStyle,
    type: GeometryType
  ): Material {
    // console.log(this.materialMap)
    if (this.materialMap[hash]) {
      // console.warn(`Duplicate material hash found: ${hash}`)
      return this.materialMap[hash]
    }

    if (material) {
      switch (type) {
        case GeometryType.MESH:
          this.materialMap[hash] = this.makeMeshMaterial(material as RenderMaterial)
          break
        case GeometryType.LINE:
          this.materialMap[hash] = this.makeLineMaterial(material as DisplayStyle)
          break
        case GeometryType.POINT:
          this.materialMap[hash] = this.makePointMaterial(material as RenderMaterial)
          break
      }
    }
    return this.materialMap[hash]
  }

  public getHighlightMaterial(renderView: NodeRenderView): Material {
    switch (renderView.geometryType) {
      case GeometryType.MESH:
        return this.meshHighlightMaterial
      case GeometryType.LINE:
        return this.lineHighlightMaterial
      case GeometryType.POINT:
        return this.pointHighlightMaterial
      case GeometryType.POINT_CLOUD:
        return this.pointCloudHighlightMaterial
    }
  }

  public getGhostMaterial(renderView: NodeRenderView): Material {
    switch (renderView.geometryType) {
      case GeometryType.MESH:
        return this.meshGhostMaterial
      case GeometryType.LINE:
        return this.lineGhostMaterial
      case GeometryType.POINT:
        return this.pointGhostMaterial
      case GeometryType.POINT_CLOUD:
        return this.pointGhostMaterial
    }
  }

  public getGradientMaterial(renderView: NodeRenderView): Material {
    switch (renderView.geometryType) {
      case GeometryType.MESH:
        return this.meshGradientMaterial
      case GeometryType.LINE:
        return this.lineGhostMaterial
      case GeometryType.POINT:
        return this.pointGhostMaterial
      case GeometryType.POINT_CLOUD:
        return this.pointGhostMaterial
    }
  }

  public getColoredMaterial(renderView: NodeRenderView): Material {
    switch (renderView.geometryType) {
      case GeometryType.MESH:
        return this.meshColoredMaterial
      case GeometryType.LINE:
        return this.lineColoredMaterial
      case GeometryType.POINT:
        return this.pointGhostMaterial
      case GeometryType.POINT_CLOUD:
        return this.pointGhostMaterial
    }
  }

  public getHiddenMaterial(renderView: NodeRenderView): Material {
    switch (renderView.geometryType) {
      case GeometryType.MESH:
        return this.meshHiddenMaterial
      case GeometryType.LINE:
        return this.lineHiddenMaterial
      case GeometryType.POINT:
        return this.meshHiddenMaterial
      case GeometryType.POINT_CLOUD:
        return this.meshHiddenMaterial
    }
  }

  public getDebugBatchMaterial(renderView: NodeRenderView) {
    const color = new Color(MathUtils.randInt(0, 0xffffff))
    color.convertSRGBToLinear()

    switch (renderView.geometryType) {
      case GeometryType.MESH:
        return new SpeckleStandardMaterial(
          {
            color,
            emissive: 0x0,
            roughness: 1,
            metalness: 0,
            opacity: 1,
            side: DoubleSide // TBD
            // clippingPlanes: this.viewer.sectionBox.planes
          },
          ['USE_RTE']
        )
      case GeometryType.LINE: {
        const mat: SpeckleLineMaterial = new SpeckleLineMaterial({
          color,
          linewidth: 1,
          worldUnits: false,
          vertexColors: true,
          alphaToCoverage: false,
          resolution: new Vector2()
        })
        mat.color = color
        mat.linewidth = 1
        mat.worldUnits = false
        mat.vertexColors = true
        mat.pixelThreshold = 0.5
        mat.resolution = new Vector2()
        return mat
      }
      case GeometryType.POINT:
        return new SpecklePointMaterial({
          color,
          vertexColors: false,
          size: 2,
          sizeAttenuation: false
        })
      case GeometryType.POINT_CLOUD:
        return new SpecklePointMaterial({
          color,
          vertexColors: true,
          size: 2,
          sizeAttenuation: false
        })
    }
  }

  public getFilterMaterial(
    renderView: NodeRenderView,
    filterMaterial: FilterMaterialType
  ) {
    switch (filterMaterial) {
      case FilterMaterialType.SELECT:
        return this.getHighlightMaterial(renderView)
      case FilterMaterialType.GHOST:
        return this.getGhostMaterial(renderView)
      case FilterMaterialType.GRADIENT:
        return this.getGradientMaterial(renderView)
      case FilterMaterialType.COLORED:
        return this.getColoredMaterial(renderView)
      case FilterMaterialType.HIDDEN:
        return this.getHiddenMaterial(renderView)
    }
  }

  public getFilterMaterialOptions(filterMaterial: FilterMaterial) {
    return {
      rampIndex:
        filterMaterial.rampIndex !== undefined ? filterMaterial.rampIndex : undefined,
      rampIndexColor: filterMaterial.rampIndexColor,
      rampTexture: filterMaterial.rampTexture ? filterMaterial.rampTexture : undefined
    }
  }

  public purge() {
    // to do
  }
}