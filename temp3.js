
        window.onerror = function(msg, url, line, col, error) {
            document.getElementById('error-log').innerHTML += msg + '<br>';
        };
        window.addEventListener('unhandledrejection', function(event) {
            document.getElementById('error-log').innerHTML += event.reason + '<br>';
        });
        const originalConsoleError = console.error;
        console.error = function(...args) {
            document.getElementById('error-log').innerHTML += args.join(' ') + '<br>';
            originalConsoleError.apply(console, args);
        };
    