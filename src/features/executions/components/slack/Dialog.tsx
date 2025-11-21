import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "variableName is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "variableName must start with a letter or underscore and contain only letters, numbers or underscores",
    }),
  content: z.string().min(1, "A message is required"),
  webhookUrl: z.string().min(1, "Webhook URL is required"),
});

export type SlackDialogFormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SlackDialogFormValues) => void;
  defaultValues?: Partial<SlackDialogFormValues>;
};

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      content: defaultValues.content || "",
      webhookUrl: defaultValues.webhookUrl || "",
    },
  });

  const watchVariableName = form.watch("variableName") || "myApiCall";

  const handleSubmit = (values: SlackDialogFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        content: defaultValues.content || "",
        webhookUrl: defaultValues.webhookUrl || "",
      });
    }
  }, [defaultValues, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
          <DialogDescription>
            Configure Slack Webhook settings for this node.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="mySlack" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes{" "}
                    {`˙{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://slack.com/api/..." />
                  </FormControl>

                  <FormDescription>
                    Get this from Slack (Workspace Settings) -- Create a
                    Workflow
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summary: {{myGemini.text}}"
                      {...field}
                      className="min-h-[120px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Use {"{{variables}}"} for simple values or{" "}
                    {"{{json variables}}"} to stringify objects. Make sure you
                    have a Slack Workflow with a variable named "content".
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
