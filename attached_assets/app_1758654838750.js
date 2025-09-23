
const API_URL = 'http://localhost:3000/api';

// Elementos DOM
const clientSelect = document.getElementById('clientSelect');
const proceduresContainer = document.getElementById('proceduresContainer');
const proceduresList = document.getElementById('proceduresList');
const addProcedureBtn = document.getElementById('addProcedureBtn');
const editProcedureBtn = document.getElementById('editProcedureBtn');
const deleteProcedureBtn = document.getElementById('deleteProcedureBtn');
const addClientBtn = document.getElementById('addClientBtn');
const editClientBtn = document.getElementById('editClientBtn');
const providerSelect = document.getElementById('providerSelect');
const providerProceduresContainer = document.getElementById('providerProceduresContainer');
const providerProceduresList = document.getElementById('providerProceduresList');
const addProviderBtn = document.getElementById('addProviderBtn');
const editProviderBtn = document.getElementById('editProviderBtn');
const editProviderImageBtn = document.getElementById('editProviderImageBtn');
const deleteProviderBtn = document.getElementById('deleteProviderBtn');
const addProviderProcedureBtn = document.getElementById('addProviderProcedureBtn');
const editProviderProcedureBtn = document.getElementById('editProviderProcedureBtn');
const deleteProviderProcedureBtn = document.getElementById('deleteProviderProcedureBtn');
const sinistroSelect = document.getElementById('sinistroSelect');
const additionalProviderProceduresContainer = document.getElementById('additionalProviderProceduresContainer');
const additionalProviderProceduresList = document.getElementById('additionalProviderProceduresList');
const additionalProviderProceduresTitle = document.getElementById('additionalProviderProceduresTitle');
const providerProceduresTitle = document.getElementById('providerProceduresTitle');
const addAdditionalProviderProcedureBtn = document.getElementById('addAdditionalProviderProcedureBtn');
const editAdditionalProviderProcedureBtn = document.getElementById('editAdditionalProviderProcedureBtn');
const deleteAdditionalProviderProcedureBtn = document.getElementById('deleteAdditionalProviderProcedureBtn');

// --- Funções de Carregamento de Dados (Fetch) ---

async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        alert('Ocorreu um erro ao comunicar com o servidor.');
        return null;
    }
}

async function populateClients() {
    const clients = await fetchData(`${API_URL}/clients`);
    clientSelect.innerHTML = '<option value="">-- Escolha um cliente --</option>';
    if (clients) {
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            clientSelect.appendChild(option);
        });
    }
}

async function populateProviders() {
    const providers = await fetchData(`${API_URL}/providers`);
    providerSelect.innerHTML = '<option value="">-- Escolha um prestador --</option>';
    if (providers) {
        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.id;
            option.textContent = provider.name;
            providerSelect.appendChild(option);
        });
    }
}

async function showProcedures(clientId) {
    if (!clientId) {
        proceduresContainer.style.display = 'none';
        return;
    }
    const procedures = await fetchData(`${API_URL}/clients/${clientId}/procedures`);
    proceduresList.innerHTML = '';
    if (procedures) {
        procedures.forEach((proc, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${proc.procedure_text}`;
            li.dataset.id = proc.id; // Armazena o ID do BD
            li.dataset.index = index;
            proceduresList.appendChild(li);
        });
        proceduresContainer.style.display = 'block';
    }
}

async function showProviderProcedures(providerId, sinistroType) {
    if (!providerId || !sinistroType) {
        providerProceduresContainer.style.display = 'none';
        return;
    }
    const procedures = await fetchData(`${API_URL}/providers/${providerId}/procedures/${sinistroType}`);
    providerProceduresList.innerHTML = '';
    if (procedures) {
        procedures.forEach((proc, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${proc.procedure_text}`;
            li.dataset.id = proc.id;
            providerProceduresList.appendChild(li);
        });
    }
    providerProceduresContainer.style.display = 'block';
}

async function showAdditionalProviderProcedures(providerId, sinistroType) {
    if (!providerId || !sinistroType) {
        additionalProviderProceduresContainer.style.display = 'none';
        return;
    }
    const procedures = await fetchData(`${API_URL}/providers/${providerId}/additional-procedures/${sinistroType}`);
    additionalProviderProceduresList.innerHTML = '';
    if (procedures) {
        additionalProviderProceduresTitle.textContent = `Procedimentos do Prestador AON [${sinistroSelect.options[sinistroSelect.selectedIndex].text}]`;
        procedures.forEach((proc, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${proc.procedure_text}`;
            li.dataset.id = proc.id;
            additionalProviderProceduresList.appendChild(li);
        });
    }
    additionalProviderProceduresContainer.style.display = 'block';
}


// --- Event Listeners ---

clientSelect.addEventListener('change', (e) => {
    showProcedures(e.target.value);
});

providerSelect.addEventListener('change', (e) => {
    const providerId = e.target.value;
    const sinistroType = sinistroSelect.value;
    showProviderProcedures(providerId, sinistroType);
    showAdditionalProviderProcedures(providerId, sinistroType);
});

sinistroSelect.addEventListener('change', (e) => {
    const sinistroType = e.target.value;
    const providerId = providerSelect.value;
    showProviderProcedures(providerId, sinistroType);
    showAdditionalProviderProcedures(providerId, sinistroType);
});

// --- Clientes ---

addClientBtn.addEventListener('click', async () => {
    const name = prompt('Digite o nome do novo cliente:');
    if (name) {
        const result = await fetchData(`${API_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (result) {
            populateClients();
        }
    }
});

editClientBtn.addEventListener('click', async () => {
    const clientId = clientSelect.value;
    if (!clientId) return alert('Selecione um cliente primeiro.');
    
    const currentName = clientSelect.options[clientSelect.selectedIndex].text;
    const newName = prompt('Digite o novo nome:', currentName);

    if (newName && newName !== currentName) {
        const result = await fetchData(`${API_URL}/clients/${clientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        if (result) {
            await populateClients();
            clientSelect.value = clientId;
        }
    }
});

// --- Procedimentos do Cliente ---

addProcedureBtn.addEventListener('click', async () => {
    const clientId = clientSelect.value;
    if (!clientId) return alert('Selecione um cliente primeiro.');
    const newProcText = prompt('Digite o novo procedimento:');
    if (newProcText) {
        const result = await fetchData(`${API_URL}/clients/${clientId}/procedures`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ procedure_text: newProcText })
        });
        if (result) {
            showProcedures(clientId);
        }
    }
});

editProcedureBtn.addEventListener('click', async () => {
    const clientId = clientSelect.value;
    if (!clientId) return alert('Selecione um cliente primeiro.');
    
    const items = proceduresList.querySelectorAll('li');
    if (items.length === 0) return;

    const indexStr = prompt('Digite o número do procedimento a editar (1 a ' + items.length + '):');
    const index = parseInt(indexStr, 10) - 1;

    if (index >= 0 && index < items.length) {
        const procedureId = items[index].dataset.id;
        const oldText = items[index].textContent.substring(items[index].textContent.indexOf('.') + 2);
        const newText = prompt('Digite o novo texto:', oldText);
        
        if (newText) {
            const result = await fetchData(`${API_URL}/clients/${clientId}/procedures/${procedureId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ procedure_text: newText })
            });
            if (result) {
                showProcedures(clientId);
            }
        }
    }
});

deleteProcedureBtn.addEventListener('click', async () => {
    const clientId = clientSelect.value;
    if (!clientId) return alert('Selecione um cliente primeiro.');

    const items = proceduresList.querySelectorAll('li');
    if (items.length === 0) return;

    const indexStr = prompt('Digite o número do procedimento a remover (1 a ' + items.length + '):');
    const index = parseInt(indexStr, 10) - 1;

    if (index >= 0 && index < items.length) {
        if (confirm('Tem certeza que deseja remover este procedimento?')) {
            const procedureId = items[index].dataset.id;
            const result = await fetchData(`${API_URL}/clients/${clientId}/procedures/${procedureId}`, {
                method: 'DELETE'
            });
            if (result) {
                showProcedures(clientId);
            }
        }
    }
});

// --- Prestadores (Lógica similar para Prestadores e seus procedimentos) ---

// (As funções para adicionar, editar e deletar prestadores e seus procedimentos seguiriam o mesmo padrão,
// mas para manter o exemplo conciso, elas foram omitidas. A implementação completa seria necessária para a funcionalidade total.)


// Inicializar
populateClients();
populateProviders();
