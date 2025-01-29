import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentos-edit',
  standalone: false,
  
  templateUrl: './documentos-edit.component.html',
  styleUrl: './documentos-edit.component.css'
})
export class DocumentosEditComponent implements OnInit {

  id!: string;
  data: any;

  formData: any = {
    NOME_DESBRAVADOR: '',
    CPF_DESBRAVADOR: '',
    RG_DESBRAVADOR: '',
    DATA_NASCIMENTO: '',
    TELEFONE_CELULAR: '',
    NOME_RESPONSAVEL: '',
    CPF_RESPONSAVEL: '',
    RG_RESPONSAVEL: '',
    UNIDADE: '',
    STATUS: ''
  };


  arquivos = [
    { nome: 'RG', link: '/path/to/arquivo1.pdf' },
    { nome: 'CPF', link: '/path/to/arquivo2.docx' },
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient,  private router: Router) {}

  ngOnInit(): void {
    // Obter o ID da rota.
    this.id = String(this.route.snapshot.paramMap.get('id'));

    // Chamar a API com o ID.
    this.getData(this.id);

    // carrega arquivos
    this.getFiles(this.id);
    
  }

  formatDateToBrazilian(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  // Converter de dd/MM/yyyy para yyyy-MM-dd
  formatDateToISO(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }

  getFiles(id: string): void {
    this.http.get<{ nome: string; link: string }[]>(`https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/list/${id}`).subscribe({
      next: (response) => {
        this.arquivos = response;
      },
      error: (err) => {
        console.error('Erro ao buscar dados', err);
      },
    });
  }

  getData(id: string): void {
    this.http.get(`https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/${id}`).subscribe({
      next: (response) => {
        this.formData = response;
        if (this.formData.DATA_NASCIMENTO) {
          this.formData.DATA_NASCIMENTO = this.formatDateToBrazilian(this.formData.DATA_NASCIMENTO);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar dados', err);
      },
    });
  }

  confirmDelete(): void {
    if (confirm(`Tem certeza que deseja excluir o regitro de "${this.formData.NOME_DESBRAVADOR}"?`)) {
      this.deleteRegistro(this.id);
    }
  }
  
  deleteRegistro(id: string): void {
    this.http.delete(`https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos?id=${id}`).subscribe({
      next: () => {
        alert('Registro excluído com sucesso.');
        console.log('Dados atualizados com sucesso:');
        this.router.navigate(['/documentos']);
      },
      error: (error) => {
        alert('Erro ao excluir o documento.');
        console.error(error);
      }
    });
  }

  
  saveData(): void {
    if (!this.id) {
      console.error('ID não encontrado para atualizar os dados.');
      return;
    }

    const dataToSend = { ...this.formData };
    if (dataToSend.DATA_NASCIMENTO) {
      dataToSend.DATA_NASCIMENTO = this.formatDateToISO(dataToSend.DATA_NASCIMENTO);
    }

    const url = `https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos`;
    this.http.put(url, dataToSend).subscribe({
      next: (response) => {
        console.log('Dados atualizados com sucesso:', response);
        this.router.navigate(['/documentos']);
      },
      error: (err) => {
        console.error('Erro ao atualizar dados:', err);
      },
    });
  }

  voltar(): void{
    this.router.navigate([`/documentos`]);
  }
}
