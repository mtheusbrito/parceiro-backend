import File from '../models/File';
import User from '../models/User';

class AvatarController {
  async update(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({
      name,
      path,
    });
    const avatar_id = file.id;
    await user.update({ avatar_id });

    return res.json(file);
  }
}

export default new AvatarController();
