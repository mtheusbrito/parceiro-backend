import Address from '../../models/Address';
import Client from '../../models/Client';

class AddressController {
  async addAddressToClient(client_id, address_id) {
    const client_db = await Client.findByPk(client_id);
    const address_db = await Address.findByPk(address_id);
    if (address_db) {
      address_db.addClient(client_db);
    }
  }
}
export default new AddressController();
