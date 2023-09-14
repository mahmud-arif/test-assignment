import React from "react"
import { Form, Input, Button, notification } from "antd"
import { useMutation, gql } from "@apollo/client"

interface Product {
	id: number
	name: string
	description: string
	price: number
	stock: number
}

const ADD_PRODUCT = gql`
	mutation AddProduct($input: products_insert_input!) {
		insert_products_one(object: $input) {
			id
			name
			description
			price
			stock
		}
	}
`

interface AddProductFormProps {
	onAddProduct: (product: Product) => void
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct }) => {
	const [form] = Form.useForm()
	const [addProduct] = useMutation(ADD_PRODUCT)

	const onFinish = async (values: Product) => {
		try {
			const { data } = await addProduct({
				variables: { input: values },
			})

			console.log("Product added:", data.insert_products_one)

			form.resetFields()
			onAddProduct(data.insert_products_one)
			notification.success({
				message: "Success",
				description: "Product added successfully",
			})
		} catch (error) {
			console.error("Error adding product:", error)
			const errorMessage = getErrorMessage(error)
			notification.error({
				message: "Error",
				description: errorMessage,
			})
		}
	}

	const getErrorMessage = (error: any) => {
		if (
			error &&
			error.message &&
			error.message.includes(
				'Uniqueness violation. duplicate key value violates unique constraint "products_name_key"'
			)
		) {
			return "A product with the same name already exists."
		}
		return "Failed to add the product"
	}

	const layout = {
		labelCol: { span: 2 },
		wrapperCol: { span: 20 },
	}

	return (
		<Form form={form} onFinish={onFinish} {...layout}>
			<Form.Item label='Name' name='name' rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item label='Description' name='description' rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item label='Price' name='price' rules={[{ required: true, min: 0 }]}>
				<Input type='number' />
			</Form.Item>
			<Form.Item label='Stock' name='stock' rules={[{ required: true, min: 0 }]}>
				<Input type='number' />
			</Form.Item>
			<Form.Item>
				<Button type='primary' htmlType='submit'>
					Add Product
				</Button>
			</Form.Item>
		</Form>
	)
}
