
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paperclip } from "lucide-react";
import { Attachment } from "@/types";

interface AttachmentsPanelProps {
  attachments: Attachment[];
}

const AttachmentsPanel: React.FC<AttachmentsPanelProps> = ({ attachments }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Anexos</CardTitle>
      </CardHeader>
      <CardContent>
        {attachments.length === 0 ? (
          <p className="text-muted-foreground">Nenhum anexo disponível</p>
        ) : (
          <ul className="space-y-2">
            {attachments.map((attachment) => (
              <li key={attachment.id} className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate"
                >
                  {attachment.fileName}
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AttachmentsPanel;
