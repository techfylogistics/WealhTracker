import { Contact } from "@/domain/models/models-index";
import { ContactRepository } from "@/domain/repositories/repositories-index";
import { ContactService } from "@/domain/services/services-index";
export class ContactServiceImpl implements ContactService {
  constructor(
    private readonly contactRepo: ContactRepository
  ) { }

  async createContact(input: Omit<Contact, 'id'>): Promise<number> {
    return this.contactRepo.create(input);
  }

  async getContact(contactId: number): Promise<Contact | null> {
    return this.contactRepo.getById(contactId);
  }

  async listContacts(): Promise<Contact[]> {
    return this.contactRepo.listAll();
  }

  async linkContactToItem(
    itemId: number,
    contactId: number,
    roleCode: string
  ): Promise<void> {
    await this.contactRepo.linkToItem(itemId, contactId, roleCode);
  }
}
