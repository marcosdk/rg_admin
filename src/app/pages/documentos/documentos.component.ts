import { Component , OnInit} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-documentos',
  standalone: false,
  
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit{
  documentos: any[] = [];
  unidade = '';
  nome = '';
  status = '';
  pageSize = 10;
  currentPage = 1; // Página atual
  totalPages = 1; // Total de páginas
  lastEvaluatedKeys: any[] = []; // Lista de lastEvaluatedKey para cada página

  //apiUrl = 'https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos';
  //apiUrl = '/api/cadastro/documentos';
  apiUrl = environment.apiUrlDocumentos;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.pesquisar();
  }

  // Carregar documentos
  loadDocumentos(): void {
    const params = new HttpParams()
      .set('page_size', this.pageSize)
      .set('unidade', this.unidade)
      .set('nome', this.nome)
      .set('status', this.status)
      .set('page', this.currentPage.toString());

    this.http.get<any>(this.apiUrl, { params }).subscribe(
      (response) => {
        this.documentos = response.items;
        this.totalPages = response.totalPages;
        this.lastEvaluatedKeys[this.currentPage - 1] = response.lastEvaluatedKey || null;
      },
      (error) => {
        console.error('Erro ao carregar documentos:', error);
      }
    );
  }

  // Ação de pesquisa
  edit(id: string): void {
    this.router.navigate([`/documentos/${id}`]);
  }

  // Ação de pesquisa
  novo(): void {
    this.router.navigate([`/documentos/novo`]);
  }

  // Ação de pesquisa
  pesquisar(): void {
    this.currentPage = 1;
    this.lastEvaluatedKeys = [];
    this.loadDocumentos();
  }

  // Alterar página
  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadDocumentos();
    }
  }

  // Próxima página
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
}
