self.addEventListener('push', (event) => {
    let { title, body, icon, tag, url } = JSON.parse(event.data && event.data.text());
    event.waitUntil(self.registration.showNotification(title || '', { body, tag, icon }));
});

self.addEventListener('notificationclick', function (event) {
    let { title, body, icon, tag, url } = JSON.parse(event.data && event.data.text());
    event.notification.close();

    event.waitUntil(
        self.clients
        .matchAll({
            type: 'window',
            includeUncontrolled: true,
        })
        .then(function (clientList) {
            if (clientList.length > 0) {
                return clientList[0].focus().then((client) => client.navigate(url));
            }
            return self.clients.openWindow(url);
        }),
    );
});