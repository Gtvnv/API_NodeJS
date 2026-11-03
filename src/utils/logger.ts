/**
 * Logger simples com timestamp, para dar observabilidade a aplicacao
 * sem depender de bibliotecas externas.
 */
export const logger = {
  info(message: string): void {
    console.log(`[${new Date().toISOString()}] INFO  ${message}`);
  },
  error(message: string, error?: unknown): void {
    console.error(`[${new Date().toISOString()}] ERROR ${message}`);
    if (error) {
      console.error(error);
    }
  },
};
