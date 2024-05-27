import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { Instagram } from './entities/instagram.entity';

@Injectable()
export class InstagramService {
  constructor(
    @InjectRepository(Instagram)
    private readonly messageRepository: Repository<Instagram>,
    private readonly httpService: HttpService,
  ) {}

  async fetchInstagramConversations(accessToken: string): Promise<any[]> {
    const url = 'https://graph.facebook.com/v12.0/me/conversations';
    console.log('Fetching Instagram conversations from URL:', url);

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          params: { access_token: accessToken },
        }),
      );

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(
        'Error fetching Instagram conversations:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async fetchInstagramMessages(
    conversationId: string,
    accessToken: string,
  ): Promise<any[]> {
    const url = `https://graph.facebook.com/v12.0/${conversationId}/messages`;
    console.log(
      'Fetching Instagram messages for conversation:',
      conversationId,
      'from URL:',
      url,
    );

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          params: { access_token: accessToken },
        }),
      );

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(
        'Error fetching Instagram messages:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async saveMessagesToDB(messages: any[]): Promise<void> {
    if (messages.length === 0) {
      console.log('No messages to save');
      return;
    }

    const messageEntities = messages.map((msg) => {
      const message = new Instagram();
      message.id = msg.id;
      message.senderId = msg.from.id;
      message.text = msg.message;
      message.timestamp = msg.created_time;
      return message;
    });
    await this.messageRepository.save(messageEntities);
  }

  async syncMessages(accessToken: string): Promise<void> {
    const conversations = await this.fetchInstagramConversations(accessToken);
    if (conversations.length === 0) {
      console.log('No conversations found');
      return;
    }

    for (const conversation of conversations) {
      const messages = await this.fetchInstagramMessages(
        conversation.id,
        accessToken,
      );
      await this.saveMessagesToDB(messages);
    }
  }
}
