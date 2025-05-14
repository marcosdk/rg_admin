import { Component , OnInit} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';
import { Clubes } from '../../componentes/clubes/clubes';

@Component({
  selector: 'app-documentos',
  standalone: false,
  
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit{
  documentos: any[] = [];
  clube = '';
  unidade = '';
  nome = '';
  nomeResp = '';
  cpf ='';
  telefone = '';
  status = '';
  pageSize = 20;
  currentPage = 1; // Página atual
  totalPages = 1; // Total de páginas
  lastEvaluatedKeys: any[] = []; // Lista de lastEvaluatedKey para cada página


   clubesDisponiveis: string[] = [];
   mostrarTodosClubes: boolean = false;
   clubeLogado = '';

  
  apiUrl = environment.apiUrlDocumentos;

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {

  
    this.clubeLogado = Clubes[this.auth.getGrupos()[0]];

    if (this.clubeLogado === 'Equipe Regional') {
      this.clubesDisponiveis = Object.values(Clubes);
      this.mostrarTodosClubes = true;
    } else {
      this.clubesDisponiveis = [this.clubeLogado];
      this.mostrarTodosClubes = false;
    }




    const state = history.state;
    if (state ) {
      
      this.clube = state.clube || '';
      this.unidade = state.unidade || '';
      this.nome = state.nome || '';
      this.nomeResp = state.nome_resp || '';
      this.cpf = state.cpf || '';
      this.telefone = state.telefone || '';
      this.status = state.status || '';
      this.pageSize = state.page_size || 20;
      this.currentPage = state.page || 1;
    }
    this.lastEvaluatedKeys = [];
    console.log('this.currentPage', this.currentPage);

    if (this.clubeLogado === 'Equipe Regional') {
      this.clube = '';
    } else {
      this.clube = this.clubeLogado;
    }    
    this.loadDocumentos();

  }

  // Carregar documentos
  loadDocumentos(): void {
    const params = new HttpParams()
      .set('page_size', this.pageSize)
      .set('unidade', this.unidade)
      .set('clube', this.clube)
      .set('nome', this.nome)
      .set('nome_resp', this.nomeResp)
      .set('cpf', this.cpf)
      .set('telefone', this.telefone)
      .set('status', this.status)
      .set('page', this.currentPage.toString());

      console.log('this.currentPage', this.currentPage);
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

    const state  = {
      page_size: this.pageSize,
      unidade:  this.unidade,
      clube: this.clube,
      nome: this.nome,
      nome_resp: this.nomeResp,
      cpf: this.cpf,
      telefone: this.telefone,
      status: this.status,
      page: this.currentPage
    }

    sessionStorage.setItem('tableState', JSON.stringify(state));


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
