import { gql, useQuery } from "@apollo/client"
import { Statistic, Card, Spin, Row, Col } from "antd"
import React from "react"

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

	if (loading) {
		return <Spin size='large' />
	}

	if (error) {
		console.error("Error fetching data:", error)
		return <div>Error fetching data</div>
	}

	const productData: Product[] = data.products

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
			<Statistic title='Total products' value={data?.products_aggregate?.aggregate.count} />
		</div>
	)
}
