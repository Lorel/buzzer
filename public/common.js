window.socket = io()

class Sound {
  constructor(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    document.body.appendChild(this.sound);
  }

  play() {
    this.sound.play()
  }
}

const ketchupBuzz = new Sound('ketchup.ogg')
const mayoBuzz = new Sound('mayo.ogg')

const play = (sound) => {
  switch (sound) {
    case 'ketchup':
      ketchupBuzz.play()
      break
    case 'mayo':
      mayoBuzz.play()
      break
  }
}

const teams = ['ketchup', 'mayo']
