import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

dotenv.config();  // Carrega as variáveis de ambiente do arquivo .env

const createUser = async () => {
  await mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  // Verifica se o usuário já existe
  const existingUser = await User.findOne({ email: 'batata@teste.com' });
  if (existingUser) {
    console.log('Usuário já existe.');
    mongoose.disconnect();
    return;
  }

  // Gera o hash da senha
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('12345', salt);

  // Cria o novo usuário
  const user = new User({
    email: 'batata@teste.com',
    senha: hashedPassword,
  });

  // Salva o usuário no banco de dados
  await user.save();
  console.log('Usuário criado com sucesso.');

  // Desconecta do banco de dados
  mongoose.disconnect();
};

createUser().catch((error) => {
  console.error('Erro ao criar usuário:', error);
  mongoose.disconnect();
});
