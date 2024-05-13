import moment from 'moment'

export function pop(e: any) {
  const amount = 1
  if (e.clientX === 0 && e.clientY === 0) {
    const bbox = e.target.getBoundingClientRect()
    const x = bbox.left + bbox.width / 2
    const y = bbox.top + bbox.height / 2
    for (let i = 0; i < 30; i++) {
      createParticle(x, y, e.target.dataset.type)
    }
  } else {
    for (let i = 0; i < amount; i++) {
      createParticle(e.clientX, e.clientY + window.scrollY, 'mario')
    }
  }
}

function createParticle(x: number, y: number, type: string) {
  const particle = document.createElement('particle')
  document.body.appendChild(particle)
  const width = 30
  const height = width
  const destinationY = -300
  const rotation = 0
  const delay = 100
  particle.style.backgroundImage = `url(/heart.png)`
  particle.style.width = `${width}px`
  particle.style.height = `${height}px`
  const animation = particle.animate(
    [
      {
        transform: `translateY(50%) translate(${x}px, ${y}px) rotate(0deg)`,
        opacity: 1,
      },
      {
        transform: `translateY(50%) translate(${x}px, ${y + destinationY}px) rotate(${rotation}deg)`,
        opacity: 0.5,
      },
    ],
    {
      duration: 500,
      easing: 'cubic-bezier(0, 1, .57, 1)',
      delay,
    },
  )
  animation.onfinish = removeParticle
}

function removeParticle(e: any) {
  e.srcElement.effect.target.remove()
}

export const getDiff = (withdrawTime: any) => {
  return moment(parseInt(withdrawTime)).diff(Date.now())
}
