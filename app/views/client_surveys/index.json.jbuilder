json.array!(@client_surveys) do |client_survey|
  json.extract! client_survey, :id, :text, :name, :email, :survey_id
  json.url client_survey_url(client_survey, format: :json)
end
