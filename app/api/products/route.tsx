
import { NextRequest, NextResponse } from "next/server";



export const POST = async (req: NextRequest) => {


  try {
    const {
      thumbnail,
      name,
      slug,
      link,
      description,
      discount,
      price,
      processingTime,
      categoryId,

    } = await req.json();

console.log(name, thumbnail);


    
    // const result = await prisma.product.create({
    //   data: {
    //     thumbnail,
    //     name,
    //     slug,
    //     link,
    //     description,
    //     discount,
    //     price,
    //     processingTime,
    //     categoryId,
   
    //   },
    // });
    return NextResponse.json(
      { message: "berhasil tambah data" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: "gagal tambah produk" });
  }
};

