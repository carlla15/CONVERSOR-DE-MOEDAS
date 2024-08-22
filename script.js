
const url = 'https://economia.awesomeapi.com.br/xml/available/uniq';
const urlConv = 'https://economia.awesomeapi.com.br/last/';

const URL_SUPA = "https://ozwkyjxewfttmigakxse.supabase.co/rest/v1/conversoes";
const HEADERS = {
    "Content-Type":"application/json",
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96d2t5anhld2Z0dG1pZ2FreHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxNzQwMjksImV4cCI6MjAzOTc1MDAyOX0.0t4bXeSY3vAkvV_4nkWz3H_R3jPBQIBIxL4ZJkkPEb0',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96d2t5anhld2Z0dG1pZ2FreHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxNzQwMjksImV4cCI6MjAzOTc1MDAyOX0.0t4bXeSY3vAkvV_4nkWz3H_R3jPBQIBIxL4ZJkkPEb0'
}

const getConversoes = async () => {
  try {
    const response = await fetch(URL_SUPA + '?order=id.desc&limit=10', {
        method: 'GET',
        headers: HEADERS       
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    adicionaTabela(json);

  } catch (error) {
      console.error(error.message);
  }
}


const insertConversao = async (data) => {
  try {
    const response = await fetch(URL_SUPA, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(data)
      }
    );
    if (!response.status === 201) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
      throw new Error(error.message);
  }
}


async function listamoedas(opcao,moedas) {
    for (let i = 0; i < moedas.length; i++) {
        const codigo = moedas[i].tagName;
        const nome = moedas[i].textContent;
        const option = document.createElement('option');
        option.value = codigo;
        option.textContent = `${nome} (${codigo})`;
        opcao.appendChild(option);
    }
}

async function carregarMoedas() {
    try {
        const response = await fetch(url);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const moedas = xmlDoc.documentElement.children;
        const moedaOrigem = document.getElementById('cmoeda');
        listamoedas(moedaOrigem,moedas)
        const moedaDestino = document.getElementById('pmoeda');
        listamoedas(moedaDestino,moedas)



    } catch (error) {
        console.error('Erro ao carregar moedas:', error);
    }
}

async function valorMoedas(cmoeda,pmoeda,valor){
    const moedas = cmoeda+'-'+pmoeda;
    const url = urlConv+moedas;
    const moeda = cmoeda+pmoeda;
    console.log(url);
    fetch(url)
  .then(res => res.json())
  .then(data => {
    const bid = data[moeda].bid;
    const valorConvertido = valor * bid;
    console.log(`O valor convertido é: ${valorConvertido}`);
    document.getElementById('valorConvertido').textContent = `${valorConvertido}`;
  })
  .catch(err => {
    document.getElementById('valorConvertido').textContent = 'Não há cotação dessa moeda';
    console.error('Erro ao buscar dados da API:', err);
  });
}

const adicionaTabela = (data) => {
  const tableBody = document.getElementById('moedasConvertidas').querySelector('tbody');
  tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os dados

  data.forEach(item => {
    const row = document.createElement('tr');

    const moedaCell = document.createElement('td');
    moedaCell.textContent = item.moedas_conversao;
    row.appendChild(moedaCell);

    tableBody.appendChild(row);
  });
}


document.getElementById('calcular').addEventListener('click', function() {
    const valor = document.getElementById('valor').value;
    const cmoeda = document.getElementById('cmoeda').value;
    const pmoeda = document.getElementById('pmoeda').value;

    const resultado = `${cmoeda} para ${pmoeda}`;
    const valorConvertido = `${valor}`;
    // colocar api para conversão aqui
    const moedas = cmoeda+'-'+pmoeda;
    valorMoedas(cmoeda,pmoeda,valor);

    const data = {
      moedas_conversao: moedas
    }

    insertConversao(data);
    // Atualiza os elementos no HTML com o resultado
    document.getElementById('resultado').textContent = resultado;

});

document.getElementById('trocar').addEventListener('click', function() {
    const cmoeda = document.getElementById('cmoeda').selectedIndex;
    const pmoeda = document.getElementById('pmoeda').selectedIndex;

    document.getElementById('cmoeda').selectedIndex = pmoeda;
    document.getElementById('pmoeda').selectedIndex = cmoeda;
});


document.addEventListener('DOMContentLoaded', function(){
  var dataAtual = new Date();
  var dia = String(dataAtual.getDate()).padStart(2, '0');
  var mes = String(dataAtual.getMonth()+1).padStart (2, '0');
  var ano = dataAtual.getFullYear();

  var dataCompleta = dia + '/' + mes + '/' + ano;
document.getElementById('dataAtual').innerText= dataCompleta;
});

window.onload = () => {carregarMoedas(),getConversoes()}