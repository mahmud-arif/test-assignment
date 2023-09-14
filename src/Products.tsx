import React, { useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { Statistic, Card, Spin, Row, Col } from "antd"
import { AddProductForm } from "./AddProductForm"

interface Product {
	id: number
	name: string
	description: string
	price: number
	stock: number
}

const GET_PRODUCTS = gql`
	query GetProducts {
		products {
			id
			name
			description
			price
			stock
		}
		products_aggregate {
			aggregate {
				count
			}
		}
	}
`

export function Products(): JSX.Element {
	const { loading, error, data } = useQuery(GET_PRODUCTS)
	const [products, setProducts] = useState<Product[]>([])

	if (loading) {
		return <Spin size='large' />
	}

	if (error) {
		console.error("Error fetching data:", error)
		return <div>Error fetching data</div>
	}

	const productData: Product[] = [...data.products, ...products]

	const handleAddProduct = (product: Product) => {
		console.log("Adding product:", product)
		setProducts([...products, product])
	}

	const totalValue: number = productData.reduce(
		(accumulator: number, product: Product) => accumulator + product.price * product.stock,
		0
	)

	return (
		<div>
			<h2>Available Products</h2>

			<Row gutter={16} style={{ display: "flex", flexWrap: "wrap" }}>
				{productData.map((product: Product) => (
					<Col span={8} key={product.id}>
						<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
							<Card title={product.name} style={{ flex: "1", marginBottom: "16px" }}>
								<p>{product.description}</p>
								<p>Price: ${product.price}</p>
								<p>In-Stock: {product.stock}</p>
							</Card>
						</div>
					</Col>
				))}
			</Row>

			<div style={{ marginTop: "20px" }}>
				<h2>Add New Product</h2>
				<AddProductForm onAddProduct={handleAddProduct} />
			</div>

			<Row gutter={16}>
				<Col span={12}>
					<Card>
						<Statistic title='Total products' value={productData?.length} />
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<Statistic title='Total value' value={`$${totalValue?.toFixed(2)}`} />
					</Card>
				</Col>
			</Row>
		</div>
	)
}
