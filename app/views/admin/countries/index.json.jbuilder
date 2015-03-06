json.array!(@admin_countries) do |admin_country|
  json.extract! admin_country, :id, :name
  json.url admin_country_url(admin_country, format: :json)
end
