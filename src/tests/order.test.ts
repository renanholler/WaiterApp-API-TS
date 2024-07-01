import request from 'supertest';
import { app } from '../app'; // Ajuste conforme necessário
import { describe, it, expect } from '@jest/globals';



describe('Registro de Pedido', () => {
  it('Deve registrar um pedido válido', async () => {
    const response = await request(app)
      .post('/api/pedidos')
      .send({
        produto: 'Pizza',
        quantidade: 2,
        mesa: 5
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Pedido registrado com sucesso');
  });
});
