/// <reference types="./pixi.d.ts" />

declare module PIXI.tilemap {
  class CanvasTileRenderer {
      renderer: PIXI.CanvasRenderer;
      tileAnim: number[];
      dontUseTransform: boolean;
      constructor(renderer: PIXI.CanvasRenderer);
  }
}
declare module PIXI.tilemap {
  class CompositeRectTileLayer extends PIXI.Container {
      constructor(zIndex?: number, bitmaps?: Array<PIXI.Texture>, texPerChild?: number);
      updateTransform(): void;
      z: number;
      zIndex: number;
      modificationMarker: number;
      shadowColor: Float32Array;
      _globalMat: PIXI.Matrix;
      _lastLayer: RectTileLayer;
      texPerChild: number;
      initialize(zIndex?: number, bitmaps?: Array<PIXI.Texture>, texPerChild?: number): void;
      setBitmaps(bitmaps: Array<PIXI.Texture>): void;
      clear(): void;
      addRect(textureIndex: number, u: number, v: number, x: number, y: number, tileWidth: number, tileHeight: number, animX?: number, animY?: number, rotate?: number, animWidth?: number, animHeight?: number): this;
      tileRotate(rotate: number): this;
      tileAnimX(offset: number, count: number): this;
      tileAnimY(offset: number, count: number): this;
      addFrame(texture_: PIXI.Texture | String | number, x: number, y: number, animX?: number, animY?: number, animWidth?: number, animHeight?: number): this;
      renderCanvas(renderer: PIXI.CanvasRenderer): void;
      renderWebGL(renderer: PIXI.WebGLRenderer): void;
      isModified(anim: boolean): boolean;
      clearModify(): void;
  }
}
declare module PIXI.tilemap {
  const Constant: {
      maxTextures: number;
      bufferSize: number;
      boundSize: number;
      boundCountPerBuffer: number;
  };
}
declare module PIXI.tilemap {
}
declare module PIXI.tilemap {
}
declare module PIXI.tilemap {
  const POINT_STRUCT_SIZE = 12;
  class RectTileLayer extends PIXI.Container {
      constructor(zIndex: number, texture: PIXI.Texture | Array<PIXI.Texture>);
      updateTransform(): void;
      z: number;
      zIndex: number;
      modificationMarker: number;
      shadowColor: Float32Array;
      _globalMat: PIXI.Matrix;
      pointsBuf: Array<number>;
      hasAnim: boolean;
      textures: Array<PIXI.Texture>;
      offsetX: number;
      offsetY: number;
      compositeParent: boolean;
      initialize(zIndex: number, textures: PIXI.Texture | Array<PIXI.Texture>): void;
      clear(): void;
      addFrame(texture_: PIXI.Texture | String | number, x: number, y: number, animX: number, animY: number): boolean;
      addRect(textureIndex: number, u: number, v: number, x: number, y: number, tileWidth: number, tileHeight: number, animX?: number, animY?: number, rotate?: number, animWidth?: number, animHeight?: number): void;
      tileRotate(rotate: number): void;
      tileAnimX(offset: number, count: number): void;
      tileAnimY(offset: number, count: number): void;
      renderCanvas(renderer: PIXI.CanvasRenderer): void;
      renderCanvasCore(renderer: PIXI.CanvasRenderer): void;
      vbId: number;
      vb: any;
      vbBuffer: ArrayBuffer;
      vbArray: Float32Array;
      vbInts: Uint32Array;
      getVb(renderer: TileRenderer): any;
      destroyVb(): void;
      renderWebGL(renderer: PIXI.WebGLRenderer): void;
      renderWebGLCore(renderer: PIXI.WebGLRenderer, plugin: PIXI.ObjectRenderer): void;
      isModified(anim: boolean): boolean;
      clearModify(): void;
      destroy(options?: PIXI.DestroyOptions | boolean): void;
  }
}
declare module PIXI.tilemap {
  import GLBuffer = PIXI.glCore.GLBuffer;
  import VertexArrayObject = PIXI.glCore.VertexArrayObject;
  abstract class TilemapShader extends PIXI.Shader {
      maxTextures: number;
      indexBuffer: GLBuffer;
      constructor(gl: WebGLRenderingContext, maxTextures: number, shaderVert: string, shaderFrag: string);
      abstract createVao(renderer: PIXI.WebGLRenderer, vb: GLBuffer): VertexArrayObject;
  }
  class RectTileShader extends TilemapShader {
      vertSize: number;
      vertPerQuad: number;
      stride: number;
      constructor(gl: WebGLRenderingContext, maxTextures: number);
      createVao(renderer: PIXI.WebGLRenderer, vb: GLBuffer): VertexArrayObject;
  }
}
declare module PIXI.tilemap.shaderGenerator {
  function fillSamplers(shader: TilemapShader, maxTextures: number): void;
  function generateFragmentSrc(maxTextures: number, fragmentSrc: string): string;
  function generateSampleSrc(maxTextures: number): string;
}
declare module PIXI.tilemap {
  class SimpleTileRenderer extends TileRenderer {
      constructor(renderer: PIXI.WebGLRenderer);
      samplerSize: Array<number>;
      onContextChange(): void;
      bindTextures(renderer: PIXI.WebGLRenderer, shader: TilemapShader, textures: Array<PIXI.Texture>): void;
      destroy(): void;
  }
}
declare module PIXI.tilemap {
  import glCore = PIXI.glCore;
  class TileRenderer extends PIXI.ObjectRenderer {
      static vbAutoincrement: number;
      static snAutoincrement: number;
      static SCALE_MODE: number;
      static DO_CLEAR: boolean;
      renderer: PIXI.WebGLRenderer;
      gl: WebGLRenderingContext;
      sn: number;
      indices: Uint16Array;
      indexBuffer: glCore.GLBuffer;
      lastTimeCheck: number;
      tileAnim: number[];
      texLoc: Array<number>;
      rectShader: RectTileShader;
      boundSprites: Array<PIXI.Sprite>;
      glTextures: Array<PIXI.RenderTexture>;
      _clearBuffer: Uint8Array;
      constructor(renderer: PIXI.WebGLRenderer);
      onContextChange(): void;
      initBounds(): void;
      bindTexturesWithoutRT(renderer: PIXI.WebGLRenderer, shader: TilemapShader, textures: Array<PIXI.Texture>): void;
      bindTextures(renderer: PIXI.WebGLRenderer, shader: TilemapShader, textures: Array<PIXI.Texture>): void;
      start(): void;
      createVb(): {
          id: number;
          vb: glCore.GLBuffer;
          vao: glCore.VertexArrayObject;
          lastTimeAccess: number;
          shader: TilemapShader;
          rendererSN: number;
      };
      checkIndexBuffer(size: number): void;
      getShader(): TilemapShader;
      destroy(): void;
  }
}
declare module PIXI.tilemap {
  class ZLayer extends PIXI.Container {
      constructor(tilemap: PIXI.Container, zIndex: number);
      tilemap: any;
      z: number;
      zIndex: number;
      _previousLayers: number;
      canvasBuffer: HTMLCanvasElement;
      _tempRender: PIXI.CanvasRenderer;
      _lastAnimationFrame: number;
      layerTransform: PIXI.Matrix;
      clear(): void;
      cacheIfDirty(): void;
      renderCanvas(renderer: PIXI.CanvasRenderer): void;
  }
}
