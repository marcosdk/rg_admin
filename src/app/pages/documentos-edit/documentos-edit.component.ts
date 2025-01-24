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
      },
      error: (err) => {
        console.error('Erro ao buscar dados', err);
      },
    });
  }

  saveData(): void {
    if (!this.id) {
      console.error('ID não encontrado para atualizar os dados.');
      return;
    }

    const url = `https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos`;
    this.http.put(url, this.formData).subscribe({
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
