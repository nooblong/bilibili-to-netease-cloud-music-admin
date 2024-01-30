import WebSocket from "ws";

const socket = new WebSocket('ws://localhost:8889/chat/me');

socket.onopen = function (e) {
    console.log('[open] Connection established');
    console.log('Sending to server');
    socket.send(
        '{\n' + '    "from": "fuck",\n' + '    "content": "fuck you"\n' + '}'
    );
};

socket.onmessage = function (event) {
    console.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
    } else {
        // 例如服务器进程被杀死或网络中断
        // 在这种情况下，event.code 通常为 1006
        console.log('[close] Connection died');
    }
};

socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
};
