json.array!(@admin_surveys) do |admin_survey|
  json.extract! admin_survey, :id, :name, :url_token
  json.url admin_survey_url(admin_survey, format: :json)
end
