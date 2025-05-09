class TabletDeploymentApp {
    constructor() {
        this.input = document.getElementById('tabletName');
        this.serialInput = document.getElementById('tabletSerial');
        this.submitBtn = document.getElementById('submitBtn');
        this.suggestionsDiv = document.getElementById('suggestions');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        // Now history is an array of objects: { name, serial }
        this.history = JSON.parse(localStorage.getItem('tabletHistory')) || [];
        this.initializeEventListeners();
        this.renderHistory();
    }

    initializeEventListeners() {
        this.input.addEventListener('input', () => this.showSuggestions());
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    showSuggestions() {
        const value = this.input.value.toLowerCase();
        if (!value) {
            this.suggestionsDiv.innerHTML = '';
            return;
        }

        const suggestions = this.history
            .filter(item => item.name.toLowerCase().includes(value))
            .slice(0, 5);

        this.suggestionsDiv.innerHTML = '';
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = suggestion.name + ' (' + suggestion.serial + ')';
            div.addEventListener('click', () => {
                this.input.value = suggestion.name;
                this.serialInput.value = suggestion.serial;
                this.suggestionsDiv.innerHTML = '';
            });
            this.suggestionsDiv.appendChild(div);
        });
    }

    handleSubmit() {
        const name = this.input.value.trim();
        const serial = this.serialInput.value.trim();
        if (!name || !serial) return;

        // Prevent duplicates by name or serial
        const duplicate = this.history.some(
            item => item.name === name || item.serial === serial
        );
        if (duplicate) {
            alert('Tablet name or serial number already exists in history.');
            return;
        }

        this.history.unshift({ name, serial });
        localStorage.setItem('tabletHistory', JSON.stringify(this.history));
        this.renderHistory();

        this.input.value = '';
        this.serialInput.value = '';
        this.suggestionsDiv.innerHTML = '';
    }

    renderHistory() {
        this.historyList.innerHTML = '';
        this.history.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            // Create text span
            const textSpan = document.createElement('span');
            textSpan.textContent = `${item.name} (${item.serial})`;
            textSpan.addEventListener('click', () => {
                this.input.value = item.name;
                this.serialInput.value = item.serial;
                this.input.focus();
            });
            
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.title = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent item selection when deleting
                this.deleteHistoryItem(index);
            });
            
            div.appendChild(textSpan);
            div.appendChild(deleteBtn);
            this.historyList.appendChild(div);
        });
    }

    deleteHistoryItem(index) {
        this.history.splice(index, 1);
        localStorage.setItem('tabletHistory', JSON.stringify(this.history));
        this.renderHistory();
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('tabletHistory');
        this.renderHistory();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TabletDeploymentApp();
});