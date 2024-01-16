import FileUploader from "@/components/shared/FileUploader"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useUserContext } from "@/context/AuthContext"
import { PostValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Models } from "appwrite"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

type PostFormProps = {
    post?: Models.Document;
    action: "Create" | "Update";
    mutate: any;
}

function PostForm({ post, action, mutate }: PostFormProps) {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const {toast} = useToast();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "",
      file: [],
      location: post?.location || "",
      tags: post?.tags.join(', ') || "",
    },
  });

  const onSubmit = async (value: z.infer<typeof PostValidation>) => {
    const newPost = await mutate({
        caption: value.caption,
        location: value.location,
        tags: value.tags,
        userId: user.id,
        file: value.file,
        imageId: post?.imageId,
        postId: post?.$id,
    })

    if (!newPost) {
      return toast({
        title: `${action} post failed. Please try again.`,
      });
    }

    navigate("/");
  };

  return (
    <div>
      <div className="max-w-5xl flex-start gap-3 justify-start w-full mb-4">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />

        <h2 className="h3-bold md:h2-bold text-left w-full">
          {action} Post
        </h2>
      </div>

      <Form {...form}>
        <form 
          className="flex flex-col gap-9"
          onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Caption</FormLabel>
                  <FormControl>
                    <Textarea className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add photos</FormLabel>
                  <FormControl>
                    <FileUploader 
                      onFileChange={field.onChange}
                      mediaUrl={post?.imageURL || ""}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add location</FormLabel>
                  <FormControl>
                    <Input className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add tags (separated by comma ",")</FormLabel>
                  <FormControl>
                    <Input className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
            >
                Cancel
            </Button>

            <Button
              type="submit"
              className="shad-button_primary"
            >
                {action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default PostForm