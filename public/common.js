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

const mayoBuzz = new Sound('mayo.ogg')
const ketchupBuzz = new Sound('ketchup.ogg')

const play = (sound) => {
  switch (sound) {
    case 'mayo':
      mayoBuzz.play()
      break
    case 'ketchup':
      ketchupBuzz.play()
      break
  }
}

const socket = io()
const teams = ['mayo', 'ketchup']
