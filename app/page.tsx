// Let me tell you a little about what I want to make, I want to make a form that is used to upload product images and data about that product
// previously I used react hook form to create a form in nextjs, then I wanted to upload the product image using the edgestore that you made, I also used shadcn ui for styling
// first import what i need

"use client";

import { Button } from "@/components/ui/button";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
});

export default function TestUploadWithForm() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SingleImageExample />
    </div>
  );
}

//  and this is my component base on docs of edgestore about uploading image

function SingleImageExample() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<
    "PENDING" | "COMPLETE" | "ERROR" | number
  >("PENDING");
  const [uploadRes, setUploadRes] = useState<{
    url: string;
    filename: string;
  }>();
  const { edgestore } = useEdgeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (file) {
      try {
        setIsSubmitting(true);
        const res = await edgestore.myPublicImages.upload({
          file,
          input: { type: "product" },
          onProgressChange: async (newProgress) => {
            setProgress(newProgress);
            if (newProgress === 100) {
              // wait 1 second to set it to complete
              // so that the user can see it at 100%
              await new Promise((resolve) => setTimeout(resolve, 1000));
              setProgress("COMPLETE");
            }
          },
        });
        setUploadRes({
          url: res.url,
          filename: file.name,
        });

        // check value of uploadRes bug always got undefined
        console.log(uploadRes);
        console.log(values);

        //  i want to send the data to this api, im using prisma on this , while I give a comment

        // const response = await axios.post("/api/products", {
        //   thumbnail: uploadRes?.url,
        //   name: values.name,
        // });

        // if (response.status === 201) {
        //   toast.success(response.data.message);
        // }
      } catch (err) {
        setProgress("ERROR");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Data</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Add Data</DialogTitle>
            <DialogDescription>insert data product</DialogDescription>
          </DialogHeader>
          <div className=" max-h-screen  ">
            <div className="flex flex-col items-center">
              <SingleImageDropzone
                height={200}
                width={200}
                value={file}
                onChange={setFile}
                disabled={progress !== "PENDING"}
                dropzoneOptions={{
                  maxSize: 1024 * 1024 * 1, // 1 MB
                }}
              />

              {uploadRes && (
                <div className="mt-2">
                  <a
                    href={uploadRes.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {uploadRes.filename}
                  </a>
                </div>
              )}
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>product name</FormLabel>
                      <FormControl>
                        <Input placeholder="product" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full my-5" size={"lg"} type="submit">
                  {isSubmitting ? (
                    <PulseLoader color="#fff" size={10} />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// what i want is, upload thumbnail product with name of ProductDetails, but i got empty string
// i've searching on google but still have no idea about it, would you gimme example usinf edgestore with react hook form? i think this is will be great tutorial if you make it
