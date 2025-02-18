import { Component, OnInit, ViewChild,ElementRef, ChangeDetectorRef , NgZone  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import imageCompression from 'browser-image-compression';


@Component({
  selector: 'app-documentos-edit',
  standalone: false,
  
  templateUrl: './documentos-edit.component.html',
  styleUrl: './documentos-edit.component.css'
})
export class DocumentosEditComponent implements OnInit {
  
  gerandoPDF: boolean = false;

  form!: FormGroup;
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

  arquivosSelecionados: string[] = [];

  

  arquivos = [
    { nome: 'RG', link: '/path/to/arquivo1.pdf', key:'rg' , extension: 'pdf', file:'' },
    { nome: 'CPF', link: '/path/to/arquivo2.docx', key:'cpf' , extension: 'pdf',file:''},
  ];

  tiposDocumentos = [
    { key: 'rgDesbravador', label: 'RG' },
    { key: 'cpfDesbravador', label: 'CPF' },
    { key: 'convenioDesbravador', label: 'Convênio do Desbravador' },
    { key: 'susDesbravador', label: 'Sus' },
    { key: 'carteiraVacDesbravador', label: 'Carteira de Vacinação do Desbravador' },
    { key: 'comResidenciaDesbravador', label: 'Comprovante de Residência' },
    { key: 'rgResponsavel', label: 'RG do Responsável' },
    { key: 'cpfResponsavel', label: 'CPF do Responsável' }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient,  private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.form = this.fb.group(
      {
        uploadArquivo: [null],
      },
    );
  }

  ngOnInit(): void {
    // Obter o ID da rota.
    this.id = String(this.route.snapshot.paramMap.get('id'));

    // Chamar a API com o ID.
    this.getData(this.id);

    // carrega arquivos
    this.getFiles(this.id);
    
  }

  getTiposDisponiveis() {
    const arquivosKeys = this.arquivos.map(a => a.key);
    return this.tiposDocumentos.filter(tipo => !arquivosKeys.includes(tipo.key));
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
    this.http.get<{ nome: string; link: string; key: string, extension: string, file:string }[]>(`https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/list/${id}`).subscribe({
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

  confirmDeleteFile(tipoArquivo: string, keyArquivo: string): void {
    if (confirm(`Tem certeza que deseja excluir o arquivo "${tipoArquivo}"?`)) {
      this.deleteFile(this.id, tipoArquivo, keyArquivo);
    }
  }

  deleteFile(idDesbravador: string, tipoArquivo: string, keyArquivo:string): void {
    const url = `https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/file/delete`;
  
    const payload = {
      idDesbravador: idDesbravador,
      tipoArquivo: keyArquivo
    };
  
    this.http.post(url, payload).subscribe({
      next: () => {
        alert(`Arquivo "${tipoArquivo}" excluído com sucesso.`);
        this.getFiles(this.id); // Atualiza a lista de arquivos
      },
      error: (error) => {
        alert('Erro ao excluir o arquivo.');
        console.error(error);
      }
    });
  }



  tipoDocumentoSelecionado: string = '';
  arquivoSelecionado: File | null = null;

  async onFileChange(event: any, fieldName: string) {
    const reader = new FileReader();
    let file = event.target.files[0];

    if (file) {


      const allowedTypes = ['image/jpeg', 'application/pdf'];

      if (!allowedTypes.includes(file.type)) {
        alert('Apenas arquivos JPG ou PDF são permitidos.');
        event.target.value = '';
        return;
      }


      // Verifica o tamanho do arquivo
      if ( file.type === 'image/jpeg' && file.size > 1 * 1024 * 1024) {
        try {
          const options = {
            maxSizeMB: 1, // Tamanho máximo em MB
            maxWidthOrHeight: 1920, // Dimensão máxima
            useWebWorker: true,
          };

          // Compacta a imagem
          file = await imageCompression(file, options);
          console.log('Arquivo compactado para:', file.size / 1024, 'KB');
        } catch (error) {
          console.error('Erro ao compactar imagem:', error);
          alert('Erro ao processar o arquivo. Tente novamente.');
          return;
        }
      }

      this.arquivoSelecionado = file;
    }

    // Se o arquivo for válido, você pode atribuí-lo ao formControl
    //this.form.patchValue({ [fieldName]: file });
    reader.onload = () => {
      this.form.patchValue({ [fieldName]: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }


  @ViewChild('fileInput') fileInput!: ElementRef;
  
  uploadDocumento() {
    if (!this.tipoDocumentoSelecionado || !this.arquivoSelecionado) {
      alert('Selecione um tipo de documento e um arquivo JPG ou PDF.');
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Simulação de envio para o servidor
    const formData = new FormData();
    formData.append('tipoDocumento', this.tipoDocumentoSelecionado);
    formData.append('arquivo', this.arquivoSelecionado);

    const apiUrlUpload   = 'https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/file';
    const payloadUpload = {
      idDesbravador: this.id,
      tipoArquivo: this.tipoDocumentoSelecionado,
      arquivo: this.form.value.uploadArquivo,
    };

    this.http.post(apiUrlUpload, payloadUpload, { headers }).subscribe(
      uploadResponse => {
        alert(`Upload do arquivo realizado com sucesso.`);
        // carrega arquivos
        this.getFiles(this.id);

        // **Resetar seleção**
        this.tipoDocumentoSelecionado = '';
        this.arquivoSelecionado = null;

        // **Limpar campo de input**
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      },
      uploadError => {
        console.error(`Erro ao fazer upload do arquivo:`, uploadError);
        alert(`Erro ao fazer upload do arquivo.`);
      }
    );


    // Aqui você chamaria o serviço para enviar para o backend/S3
    console.log('Enviando documento:', this.tipoDocumentoSelecionado, this.arquivoSelecionado.name);


    // Resetar seleção
    this.tipoDocumentoSelecionado = '';
    this.arquivoSelecionado = null;
  }



  selecionarTodosJPG() {
    console.log('Selecionar/Desmarcar todos os arquivos JPG');
  
    const jpgs = this.arquivos.filter(arquivo => arquivo.extension.toLowerCase() === 'jpg').map(arquivo => arquivo.file);
  
    if (this.arquivosSelecionados.length === jpgs.length) {
      // Se todos os JPGs estão selecionados, desmarcar todos
      this.arquivosSelecionados = [];
      console.log('Todos desmarcados:', this.arquivosSelecionados);
    } else {
      // Se nem todos estão selecionados, marcar todos
      this.arquivosSelecionados = jpgs;
      console.log('Todos selecionados:', this.arquivosSelecionados);
    }
  }
  

  toggleArquivo(arquivo: any) {
    console.log('toggleArquivo');
    if (arquivo.extension.toLowerCase() === 'jpg') {
      console.log('jpg');
      const index = this.arquivosSelecionados.indexOf(arquivo.file);
      console.log('index %d', index);
      if (index === -1) {
        this.arquivosSelecionados.push(arquivo.file);
      } else {
        this.arquivosSelecionados.splice(index, 1);
      }
    }
  }


  gerarPDF() {



    this.ngZone.run(() => {
      this.gerandoPDF = true;
    });    
    this.cdr.detectChanges(); // Força o Angular a atualizar a UI
    

    const body = {
      fileName: this.formData.NOME_DESBRAVADOR, // 'Lucas Pingituro Domingues',
      fileKeys: this.arquivosSelecionados
    };

    console.log(body);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    this.http.post<{ message: string; pdfUrl: string }>(
      'https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/pdf',
      body,
      { headers }
    ).subscribe(response => {
      this.ngZone.run(() => {
        this.gerandoPDF = false;
      });
      this.cdr.detectChanges(); // Força o Angular a atualizar a UI
    
      if (response.pdfUrl) {
        window.open(response.pdfUrl, '_blank'); // Aguarda um pouco antes de abrir
        
      }
    }, error => {
      this.ngZone.run(() => {
        this.gerandoPDF = false; // Garantir que o loading some
      });
      this.cdr.detectChanges(); // Força o Angular a atualizar a UI
      console.error('Erro na requisição:', error);
    });
  }


}
