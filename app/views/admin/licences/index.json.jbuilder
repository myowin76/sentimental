json.array!(@admin_licences) do |admin_licence|
  json.extract! admin_licence, :id, :name
  json.url admin_licence_url(admin_licence, format: :json)
end
