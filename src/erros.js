class InvalidArgumentError extends Error {
    constructor(mensagem) {
      super(mensagem);
      this.name = 'InvalidArgumentError';
    }
  }
  
  class InternalServerError extends Error {
    constructor(mensagem) {
      super(mensagem);
      this.name = 'InternalServerError';
    }
  }

  class NaoEncontrado extends Error {
    constructor(entidade) {
      const mensagem = `Não foi possivel encontrar ${entidade}`
      super(mensagem)
      this.name = 'Não encontrado' 
    }
  }

  class NaoAutorizado extends Error {
    constructor() {
      const mensagem = `Não foi possivel acessar esse recurso`
      super(mensagem)
      this.name = 'Não Autorizado'
    }
  }
  
  module.exports = {
    InvalidArgumentError: InvalidArgumentError,
    InternalServerError: InternalServerError,
    NaoEncontrado: NaoEncontrado,
    NaoAutorizado: NaoAutorizado
  };
  