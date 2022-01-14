const welcomeEvent = () => {
    const parent = document.querySelector('.chat-events')
    const message = document.createElement('li')
    const messageItem = document.createElement('span')
    messageItem.textContent = 'Welcome to game'
    message.appendChild(messageItem)
    parent.appendChild(message)
}

const writeEvent = (msgObj) => {
    // <ul> element
    const parent = document.querySelector('.chat-events')
    let acID = document.querySelector('#account-id').textContent

    // <li> element
    const message = document.createElement('li')
    const messageItem = document.createElement('span')

    // input message in to message item
    messageItem.textContent = `${msgObj.name} : ${msgObj.msg}`

    // check who send
    if (msgObj.user === acID.substring(10)) {
        // Me
        message.classList.add('right')
        console.log(acID)
    }

    // input message item in to list message
    message.appendChild(messageItem)
    parent.appendChild(message)
}

const writeGameEvent = (text) => {
    // <ul> element
    const parent = document.querySelector('.game-events')

    // <li> element
    const message = document.createElement('li')
    const messageItem = document.createElement('span')

    // input message in to message item
    messageItem.textContent = text

    // input message item in to list message
    message.appendChild(messageItem)
    parent.appendChild(message)
}

const onFormSubmitted = e => {
    e.preventDefault()

    const inputChat = document.querySelector('#input-chat')
    const text = inputChat.value
    inputChat.value = ''

    let name = document.querySelector('#account').textContent
    let acID = document.querySelector('#account-id').textContent

    let payload = {
        name: name.substring(12),
        msg: text,
        user: acID.substring(10)
    }

    socket.emit('message', payload)
}

const addButtonListener = () => {
    ['btn-rock', 'btn-paper', 'btn-scissors'].forEach(id => {
        const btn = document.getElementById(id)
        btn.addEventListener('click', () => {
            console.log()
            socket.emit('turn', id)
        })
    })
}

const socket = io()

welcomeEvent()

// เรียกใช้ function socket name message 
socket.on('messageFirst', (text) => {
    const parent = document.querySelector('.chat-events')
    const message = document.createElement('li')
    const messageItem = document.createElement('span')
    messageItem.textContent = text
    message.appendChild(messageItem)
    parent.appendChild(message)
})
socket.on('message', writeEvent)
socket.on('messageGame', writeGameEvent)

document.querySelector('#form-send-chat').addEventListener('submit', onFormSubmitted)

addButtonListener()