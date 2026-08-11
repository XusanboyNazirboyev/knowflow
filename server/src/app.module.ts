import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspaceModule } from './modules/workspaces/workspaces.module';
import { StorageModule } from './modules/storage/storage.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    WorkspaceModule,
    StorageModule,
    DocumentsModule

  ],
})
export class AppModule {}
