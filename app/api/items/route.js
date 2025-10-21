import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';// GET all items with optional search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const category = searchParams.get('category');
    
    const client = await clientPromise;
    const db = client.db('crudapp');
    
    let query = {};
    
    // Build search query
    if (searchQuery) {
      const searchRegex = { $regex: searchQuery, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
      
      // Search in custom fields values
      const customFieldsConditions = [];
      
      // Create conditions for searching in custom field values
      const sampleItem = await db.collection('items').findOne({ customFields: { $exists: true } });
      if (sampleItem && sampleItem.customFields) {
        Object.keys(sampleItem.customFields).forEach(key => {
          customFieldsConditions.push({
            [`customFields.${key}`]: searchRegex
          });
        });
      }
      
      // Add a general search for any custom field value
      customFieldsConditions.push({
        $where: `function() {
          if (this.customFields) {
            for (let key in this.customFields) {
              if (this.customFields[key] && this.customFields[key].toString().toLowerCase().includes('${searchQuery.toLowerCase()}')) {
                return true;
              }
            }
          }
          return false;
        }`
      });
      
      if (customFieldsConditions.length > 0) {
        query.$or = query.$or.concat(customFieldsConditions);
      }
    }
    
    // Add category filter
    if (category && category !== 'all') {
      if (query.$or) {
        query = { $and: [{ category }, { $or: query.$or }] };
      } else {
        query.category = category;
      }
    }
    
    const items = await db.collection('items').find(query).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} }
    );
  }
}

// POST create new item
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('crudapp');
    
    const result = await db.collection('items').insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newItem = await db.collection('items').findOne({ _id: result.insertedId });
    
    return NextResponse.json(
      { success: true, data: newItem },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update item
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('crudapp');
    
    await db.collection('items').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    const updatedItem = await db.collection('items').findOne({ _id: new ObjectId(_id) });
    
    return NextResponse.json(
      { success: true, data: updatedItem },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('crudapp');
    
    await db.collection('items').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json(
      { success: true, message: 'Item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

