// ChessPiece.js
import * as THREE from '../libs/three.module.js'
import { MovementStrategy } from './MovementStrategies.js'
// No necesitas importar Torre aquí explícitamente para esta solución,
// ya que la pasas como un parámetro genérico 'model'.

/**
 * ChessPiece envuelve un gráfico y delega raycast correctamente.
 */
class ChessPiece extends THREE.Object3D {
  /**
   * @param {THREE.Object3D} model - gráfico de la pieza (puede ser Group con Meshes)
   * @param {MovementStrategy} movementStrategy
   */
  constructor(model, movementStrategy) {
    super()
    if (!(movementStrategy instanceof MovementStrategy)) {
      throw new Error('movementStrategy debe extender MovementStrategy')
    }
    this.movementStrategy = movementStrategy
    
    // CRÍTICO: Almacena la referencia a la instancia del modelo original (Ej: una instancia de Torre)
    this.originalModel = model; 

    // Clonamos solo el aspecto visual para el gráfico.
    // La lógica de animación se gestiona a través de this.originalModel.
    this.graphic = model; 
    this.add(this.graphic);

    this.userData = { fila: 0, columna: 0 };
  }

  /**
   * Raycast personalizado: solo reasignamos los intersecciones nuevas a esta pieza
   */
  raycast(raycaster, intersects) {
    const prevLen = intersects.length
    this.graphic.traverse(child => {
      if (child.isMesh) child.raycast(raycaster, intersects)
    })
    for (let i = prevLen; i < intersects.length; i++) {
      intersects[i].object = this
    }
  }

  /**
   * Devuelve las casillas legales según la estrategia
   */
  getLegalMoves(board) {
    const { fila, columna } = this.userData
    return this.movementStrategy.getLegalMoves(fila, columna, board, this)
  }

  // --- Métodos para activar animaciones de la Torre ---
  /**
   * Intenta iniciar la animación de caminar del modelo original (si es una Torre).
   */
  updatePiernasRotation() {
    if (this.originalModel && typeof this.originalModel.updatePiernasRotation === 'function') {
      this.originalModel.updatePiernasRotation();
    } else {
      // console.warn("La pieza no es una Torre o no tiene el método startWalkingAnimation.");
      // No es un problema si otras piezas no tienen animaciones.
    }
  }

  /**
   * Intenta iniciar la animación de lucha del modelo original (si es una Torre).
   */
  startFighting() {
    if (this.originalModel && typeof this.originalModel.startFightingAnimation === 'function') {
      this.originalModel.startFightingAnimation();
    } else {
      // console.warn("La pieza no es una Torre o no tiene el método startFightingAnimation.");
    }
  }

  /**
   * Intenta detener todas las animaciones del modelo original (si es una Torre).
   */
  stopAnimations() {
    if (this.originalModel && typeof this.originalModel.stopAllAnimations === 'function') {
      this.originalModel.stopAllAnimations();
    } else {
      // console.warn("La pieza no es una Torre o no tiene el método stopAllAnimations.");
    }
  }

  update() {
          this.originalModel.update();
  }
}

export { ChessPiece }