export function setPosition(element: HTMLElement) {
  const { style } = element

  const positionX = Math.random() * 100
  const positionY = Math.random() * 100

  style.top = `${positionY}%`
  style.left = `${positionX}%`
}
